import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ResortList () {
    useEffect(()=>{
        axios.get("http://localhost:9001/testAPI/resorts")
        .then(function(response) {
            try {
                var resortsInResponse = JSON.parse(response.data).map(x => { 
                    let formatted_x = x.replace("resorts:", "").replaceAll('"',"");
                    return formatted_x;
                });
                setResortList(resortsInResponse);
            } catch (e) {
                setErrors(response.data);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
    }, []);    

    const [resortList, setResortList] = useState([]);

    const [errors, setErrors] = useState("");

    return (
        <div>
            <h3>Resort List</h3>            
            <table style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <tr>
                    <th>Name</th>
                </tr>
                { resortList.map(x => {
                    return <tr><td>{x}</td></tr>
                }) }
            </table>
            <div>
                {errors}
            </div>
            
        </div>
    )
    
}

export default ResortList