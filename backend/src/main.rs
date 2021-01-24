mod lib;
use std::ffi::{CString, CStr};

fn main() -> std::io::Result<()> {
    let c_str = CString::new("customers:*").unwrap();
    let response = lib::mget_by_pattern(c_str.as_ptr() as *const i8);
    println!("main: {:?}", unsafe { CStr::from_ptr(response) });
    Ok(())
}

