import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

function ResortDelete (props) {
    const [state, setState] = useState({
        name: props.location.del_id
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
        axios.post("http://localhost:9001/testAPI/resort_delete", state)
        .then(function(response) {
            if(response.data===0) { 
                setErrors("There is no resort with that name.");
            } 
            else {
                history.push({
                    pathname: '/bye_r',
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
                <h3>Resort Delete</h3>
            </div>
            <form onSubmit={onSubmitHandler}>
                <div>
                    <label htmlFor="name">Name: </label>
                    <input readOnly required type="text" name="name" value={name} onChange={onChangeHandler}></input>
                </div>
                <div>
                    {errors}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
    
}

export default ResortDelete