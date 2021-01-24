import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerList () {
    useEffect(()=>{
        axios.get("http://localhost:9001/testAPI/customers")
        .then(function(response) {
            if(typeof response.data !== "string") {
                var customersInResponse = response.data.map(x => {
                    return Object.values(x);
                });
                setCustomerList(customersInResponse);
            } else {
                setErrors(response.data);
            }            
            
        })
        .catch(function(err) {
            console.log(err);
        });
    }, []);    

    const [customerList, setCustomerList] = useState([]);

    const [errors, setErrors] = useState("");

    return (
        <div>
            <h3>Customer List</h3>            
            <table style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email Address</th>
                    <th>Favorite Resort</th>
                </tr>
                { customerList.map(x => {
                    return <tr>{x.map(y => {
                        return <td>{y}</td>
                    })}</tr>
                }) }
            </table>
            <div>
                {errors}
            </div>
            
        </div>
    )
    
}

export default CustomerList