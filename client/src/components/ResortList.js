import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

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

    const history = useHistory();

    const onClickHandler = (x) => {
        history.push({
            pathname: '/resort_delete',
            del_id: x.target.id
        });
    };

    return (
        <div>
            <h3>Resort List</h3>            
            <table style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <thead>
                <tr key="trHeader">
                    <th>Name</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                { resortList.map(x => {
                    return <tr key={x}>
                        <td>{x}</td>
                        <td>
                        <button id={x} onClick={onClickHandler}>Del</button>
                        </td>
                        </tr>
                }) }
                </tbody>
            </table>
            <div>
                {errors}
            </div>
            
        </div>
    )
    
}

export default ResortList