#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::{
    fs,
    path::{Path, PathBuf},
};

fn unzip(target: &str, dir: &Path) {
    let mut archive = zip::ZipArchive::new(fs::File::open(target).unwrap()).unwrap();

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
        let _ = fs::remove_dir_all(apps);
    } else {
        fs::create_dir(apps).expect("failed to create apps directory");
    }

    let paths = fs::read_dir(source).unwrap();

    for path in paths {
        let fullpath = path.as_ref().unwrap().path().display().to_string();
        let name = path.as_ref().unwrap().file_name().into_string().unwrap();
        let target = fullpath.clone();
        let dir = Path::new("").join(apps).join(name);

        unzip(&target, &dir);
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
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
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
