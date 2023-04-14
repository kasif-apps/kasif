#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
    thread,
    time::Duration,
};

use tauri::Manager;

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

async fn run_conductor() {
    let output = Command::new("conductor")
        .output()
        .expect("failed to launch conductor");

    println!("{}", String::from_utf8_lossy(&output.stdout));
}

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.app_handle();

            tokio::spawn(run_conductor());
            load_plugins(&app_handle);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_devtools,
            load_plugins_remote,
            launch_auth,
            close_splashscreen
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
