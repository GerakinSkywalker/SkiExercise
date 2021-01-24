import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

function ResortRegistration () {
    const [state, setState] = useState({
        name: ''
    });

    const [errors, setErrors] = useState("");

    const history = useHistory();
    
    const onChangeHandler = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();        
        axios.post("http://localhost:9001/testAPI/resort_registration", state)
        .then(function(response) {
            if(response.data===0) { 
                setErrors("There is already a resort with that name.");
            } 
            else {
                history.push({
                    pathname: '/thank_you_rr',
                    state: state
                });
            }
        })
        .catch(function(err) {
            console.log(err);
        });        
    }
    
    const { name } = state;

    return (
        <div>
            <div>
                <h3>Resort Registration</h3>
            </div>
            <form onSubmit={onSubmitHandler}>
                <div>
                    <label htmlFor="name">Name: </label>
                    <input required type="text" name="name" value={name} onChange={onChangeHandler}></input>
                </div>
                <div>
                    {errors}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
    
}

export default ResortRegistration