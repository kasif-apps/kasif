#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::{
    fs,
    path::{Path, PathBuf},
};

use tauri::{Manager, WindowEvent};
use tokio::process::Command;

fn unzip(target: &str, dir: &Path) {
    let mut archive = zip::ZipArchive::new(fs::File::open(target).expect("failed to open target"))
        .expect("failed to create zip archive");

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).unwrap();
        let outpath = PathBuf::from(dir).join(file.mangled_name());

        if (&*file.name()).ends_with('/') {
            fs::create_dir_all(&outpath).unwrap();
        } else {
            if let Some(p) = outpath.parent() {
                if !p.exists() {
                    fs::create_dir_all(&p).unwrap();
                }
            }
            let mut outfile = fs::File::create(&outpath).unwrap();
            std::io::copy(&mut file, &mut outfile).unwrap();
        }
    }
}

#[tauri::command]
fn open_devtools(window: tauri::Window) -> String {
    window.open_devtools();

    return "ok".to_string();
}

#[tauri::command]
fn launch_auth(path: String) {
    opener::open(path).expect("Failed to launch url");
}

fn load_plugin(resource_path: &PathBuf, plugin_path: PathBuf) {
    let name = plugin_path
        .file_name()
        .unwrap()
        .to_str()
        .expect("failed to convert to string");

    let dir = Path::new("")
        .join(&resource_path)
        .join(name)
        .with_extension("");

    unzip(&plugin_path.as_os_str().to_str().unwrap().to_string(), &dir);
}

fn load_installed_plugins(app: &tauri::AppHandle) {
    let resource_path = app
        .path_resolver()
        .resolve_resource("apps")
        .expect("failed to resolve resource");

    let mut plugin_source_path = app
        .path_resolver()
        .app_local_data_dir()
        .expect("failed to resolve app local data dir");

    plugin_source_path.push("apps");

    // Unpack plugins
    if resource_path.exists() {
        let _ = fs::remove_dir_all(&resource_path).expect("failed to remove apps directory");
    }

    fs::create_dir(&resource_path).expect("failed to create apps directory");

    let paths = fs::read_dir(plugin_source_path).expect("failed to read source directory");

    for path in paths {
        let entry = &path.unwrap();
        let fullpath = entry.path().into_os_string().to_str().unwrap().to_string();

        if fullpath.ends_with(".kasif") {
            load_plugin(&resource_path, entry.path());
        }
    }
}

fn load_external_plugins(app: &tauri::App) {
    match app.get_cli_matches() {
        Ok(matches) => {
            let debug = matches.args.get("debug").unwrap().value.as_bool().unwrap();

            if debug {
                let resource_path = app
                    .path_resolver()
                    .resolve_resource("apps")
                    .expect("failed to resolve resource");

                matches
                    .args
                    .get("plugin")
                    .unwrap()
                    .value
                    .as_array()
                    .unwrap()
                    .iter()
                    .for_each(|plugin| {
                        let plugin_path = plugin.as_str().unwrap().to_string();

                        load_plugin(&resource_path, Path::new("").join(plugin_path));
                    });
            }
        }

        Err(_) => {}
    }
}

#[tauri::command]
fn load_plugin_remotely(resource_path: String, plugin_path: String) {
    load_plugin(
        &Path::new("").join(resource_path),
        Path::new("").join(plugin_path),
    )
}

async fn run_conductor(app: tauri::AppHandle) {
    let mut root_path = app
        .path_resolver()
        .resolve_resource("")
        .expect("failed to resolve resource");

    root_path.push("apps");

    let resource_path = root_path.to_str().expect("failed to convert to string");

    let mut script_path = app.path_resolver().app_local_data_dir().unwrap();
    script_path.push("remote");
    script_path.push("server.ts");

    Command::new("deno")
        .arg("run")
        .arg("-A")
        .arg(script_path)
        .arg(resource_path)
        .spawn()
        .expect("failed to launch conductor");
}

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
}

async fn run(instance: tauri::Builder<tauri::Wry>) {
    instance
        .run(tauri::generate_context!())
        .expect("failed to run tauri");
}

#[tokio::main]
async fn main() {
    let instance = tauri::Builder::default()
        .setup(move |app| {
            let app_handle = app.app_handle();
            load_installed_plugins(&app_handle);
            load_external_plugins(&app);

            let handle = app_handle.clone();
            let task = tokio::spawn(run_conductor(handle));

            let windows = app_handle.windows();
            let window = windows.get("main").expect("failed to get main window");

            window.on_window_event(move |event| match event {
                WindowEvent::Destroyed => {
                    task.abort();
                }
                _ => {}
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_plugin_remotely,
            open_devtools,
            launch_auth,
            close_splashscreen
        ]);

    run(instance).await;
}
