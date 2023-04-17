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

fn unpack_plugins(apps: &PathBuf, source: PathBuf) {
    if apps.exists() {
        let _ = fs::remove_dir_all(apps).expect("failed to remove apps directory");
    }
    fs::create_dir(apps).expect("failed to create apps directory");

    let paths = fs::read_dir(source).expect("failed to read source directory");

    for path in paths {
        let fullpath = path.as_ref().unwrap().path().display().to_string();
        let name = path.as_ref().unwrap().file_name().into_string().unwrap();
        let target = fullpath.clone();
        let dir = Path::new("").join(apps).join(name);

        if target.ends_with(".kasif") {
            unzip(&target, &dir);
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

#[tauri::command]
fn load_plugins_remote(app_handle: tauri::AppHandle) {
    load_plugins(&app_handle)
}

fn load_plugins(app: &tauri::AppHandle) {
    let resource_path = app
        .path_resolver()
        .resolve_resource("apps")
        .expect("failed to resolve resource");

    let mut plugin_source_path = app
        .path_resolver()
        .app_local_data_dir()
        .expect("failed to resolve app local data dir");

    plugin_source_path.push("apps");

    unpack_plugins(&resource_path, plugin_source_path);
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

async fn run_conductor(app: tauri::AppHandle) {
    let root_path = app
        .path_resolver()
        .resolve_resource("")
        .expect("failed to resolve resource");

    let resource_path = root_path.to_str().expect("failed to convert to string");

    let clone = &root_path.clone();
    let joined = clone.join("remote");
    let script_path = joined.join("server.ts");

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

            load_plugins(&app_handle);
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
            open_devtools,
            load_plugins_remote,
            launch_auth,
            close_splashscreen
        ]);

    run(instance).await;
}
