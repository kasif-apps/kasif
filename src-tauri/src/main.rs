#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::{fs, path::PathBuf};

fn unzip(target: &str, dir: &str) {
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

fn unpack_plugins() {
    let _ = fs::remove_dir_all("/Users/muhammedalican/Documents/repos/kasif/public/apps");

    let paths = fs::read_dir("/Users/muhammedalican/Desktop/plugins").unwrap();

    for path in paths {
        let fullpath = path.as_ref().unwrap().path().display().to_string();
        let name = path.as_ref().unwrap().file_name().into_string().unwrap();
        let target = fullpath.clone();

        let dir = "/Users/muhammedalican/Documents/repos/kasif/public/apps";
        let dir = format!("{}/{}", dir, name);

        unzip(&target, &dir);
    }
}

fn main() {
    unpack_plugins();

    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
