#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[path = "watcher.rs"]
mod watcher;
// use watcher::Watcher;

fn main() {
    tauri::Builder::default()
        .plugin(watcher::Watcher::default())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
