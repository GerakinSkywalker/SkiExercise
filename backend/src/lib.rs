use std::ffi::{CString, CStr};
use std::os::raw::c_char;
use std::str;
use serde_json::{Value};
use redis::Commands;

static CONN_STR: &'static str = "redis://127.0.0.1/";

#[no_mangle]
pub extern fn get_by_key(key: *const c_char) -> *const c_char {
    let c_str = unsafe { CStr::from_ptr(key) };
    let response = CString::new(get(c_str.to_str().unwrap()).unwrap()).unwrap();
    let result = response.as_ptr();
    std::mem::forget(response);
    result
}

#[no_mangle]
pub extern fn del_by_key(key: *const c_char) -> *const c_char {
    let c_str = unsafe { CStr::from_ptr(key) };
    let response = CString::new(del(c_str.to_str().unwrap()).unwrap()).unwrap();
    let result = response.as_ptr();
    std::mem::forget(response);
    result
}

#[no_mangle]
pub extern fn scan_by_pattern(pattern: *const c_char) -> *const c_char {
    let c_str = unsafe { CStr::from_ptr(pattern) };
    
    let response = CString::new(scan(c_str.to_str().unwrap()).unwrap()).unwrap();
    let result = response.as_ptr();
    std::mem::forget(response);
    result
}

#[no_mangle]
pub extern fn mget_by_pattern(pattern: *const c_char) -> *const c_char {
    let c_str = unsafe { CStr::from_ptr(pattern) };
    
    let response = CString::new(mget(c_str.to_str().unwrap()).unwrap()).unwrap();
    let result = response.as_ptr();
    std::mem::forget(response);
    result
}

#[no_mangle]
pub extern fn customer_registration(json_string: *const c_char) -> *const c_char {
    let c_str = unsafe { CStr::from_ptr(json_string) };
    let unwrapped_string = c_str.to_str().unwrap();

    // Parse the string of data into serde_json::Value.
    let json: Value = serde_json::from_str(unwrapped_string).unwrap();

    let mut key: String = "customers:".to_owned();
    key.push_str(&json["email_address"].to_string());
    let response = CString::new(setnx(&key, unwrapped_string).unwrap()).unwrap();
    let result = response.as_ptr();
    std::mem::forget(response);
    result
}

#[no_mangle]
pub extern fn resort_registration(json_string: *const c_char) -> *const c_char {
    let c_str = unsafe { CStr::from_ptr(json_string) };
    let unwrapped_string = c_str.to_str().unwrap();
    
    // Parse the string of data into serde_json::Value.
    let json: Value = serde_json::from_str(unwrapped_string).unwrap();

    let mut key: String = "resorts:".to_owned();
    key.push_str(&json["name"].to_string());
    let response = CString::new(setnx(&key, unwrapped_string).unwrap()).unwrap();
    let result = response.as_ptr();
    std::mem::forget(response);
    result
}

fn get(key: &str) -> redis::RedisResult<String> {
    // connect to redis
    let client = redis::Client::open(CONN_STR)?;
    let mut con = client.get_connection()?; //To Do: DRY
    // read back the key and return it.
    let response = con.get(key)?;
    Ok(response)
}

fn del(key: &str) -> redis::RedisResult<String> {
    // connect to redis
    let client = redis::Client::open(CONN_STR)?;
    let mut con = client.get_connection()?; //To Do: DRY
    // read back the key and return it.
    let response : i8 = con.del(key)?;
    Ok(response.to_string())
}

fn setnx(key: &str, json_string: &str) -> redis::RedisResult<String> {
    // connect to redis
    let client = redis::Client::open(CONN_STR)?;
    let mut con = client.get_connection()?; //To Do: DRY
    
    let response : i8 = redis::cmd("SETNX").arg(key).arg(json_string).query(&mut con)?;
    Ok(response.to_string())
}

fn scan(pattern: &str) -> redis::RedisResult<String> {
    // connect to redis
    let client = redis::Client::open(CONN_STR)?;
    let mut con = client.get_connection()?; //To Do: DRY
    
    let response : Vec<(Vec<u8>,Vec<Vec<u8>>)> = redis::cmd("SCAN").arg(0).arg("MATCH").arg(pattern).arg("COUNT").arg(100).query(&mut con)?; //To Do: receive count as param instead of hardcoding a 100
    let mut v: Vec<&str> = Vec::new();
    for elem in &(response[0]).1 {
        v.push(str::from_utf8(elem).unwrap());   
    }
    
    let mut json : String = "".to_owned();
    if v.len() > 0 {
        json.push_str("[");
        for elem in v {
            json.push_str(&serde_json::to_string(elem).unwrap());
            json.push(',');
        }
        json.pop();
        json.push_str("]");

        return Ok(serde_json::to_string(&json).unwrap());
    }

    let mut pattern_display : String = pattern.to_owned();
    pattern_display.pop();
    pattern_display.pop();
    Ok(format!("There are no {} in the database", pattern_display))
}

fn mget(pattern: &str) -> redis::RedisResult<String> {
    // connect to redis
    let client = redis::Client::open(CONN_STR)?;
    let mut con = client.get_connection()?; //To Do: DRY
    
    let response : Vec<(Vec<u8>,Vec<Vec<u8>>)> = redis::cmd("SCAN").arg(0).arg("MATCH").arg(pattern).arg("COUNT").arg(100).query(&mut con)?; //To Do: receive count as param instead of hardcoding a 100
    let mut v: Vec<&str> = Vec::new();
    for elem in &(response[0]).1 {        
        v.push(str::from_utf8(elem).unwrap());   
    }

    if v.len() > 0 {
        let mut algo = redis::cmd("MGET");
        for elem in v {
            algo.arg(elem);
        }
        
        let response_2 : Vec<Vec<u8>> = algo.query(&mut con)?;
        
        let mut v_2: Vec<&str> = Vec::new();
        for elem in &response_2 {
            v_2.push(str::from_utf8(elem).unwrap());   
        }

        let mut json : String = "".to_owned();
        if v_2.len() > 0 {
            json.push_str("[");
            for elem in v_2 {
                json.push_str(elem);
                json.push(',');
            }
            json.pop();
            json.push_str("]");
    
            return Ok(json);
        }
    }

    let mut pattern_display : String = pattern.to_owned();
    pattern_display.pop();
    pattern_display.pop();
    Ok(format!("There are no {} in the database", pattern_display))
}