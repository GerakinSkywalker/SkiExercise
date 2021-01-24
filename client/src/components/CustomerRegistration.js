import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Select from 'react-select';

function CustomerRegistration () {
    const [resorts, setResorts] = useState([]);

    useEffect(()=>{
        axios.get("http://localhost:9001/testAPI/resorts")
        .then(function(response) {
            try {
                var resortsInResponse = JSON.parse(response.data).map(x => { 
                    let formatted_x = x.replace("resorts:", "").replaceAll('"',"");
                    return { value: formatted_x, label: formatted_x };
                });
                setResorts(resortsInResponse);
                setState(prevState => ({
                    ...prevState,
                    "favorite_resort": resortsInResponse[0]
                }));
            } catch (e) {
                setErrors(response.data);
            }            
            
        })
        .catch(function(err) {
            console.log(err);
        });
    }, []);    

    const [state, setState] = useState({
        first_name: '',
        last_name: '',
        email_address: '',
        favorite_resort: ''
    });

    const [errors, setErrors] = useState("");

    const history = useHistory();
    
    const onChangeHandler = (e) => {
        if(e.target.name === "email_address") { //simple and ugly error reset
            setErrors("");
        }

        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const onChangeOptionHandler = selectedOption => {
        setState(prevState => ({
            ...prevState,
            "favorite_resort": selectedOption
        }));
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if(state.favorite_resort !== ""){
            axios.post("http://localhost:9001/testAPI/customer_registration", state)
            .then(function(response) {
                if(response.data===0) { 
                    setErrors("There is already a customer with that email address.");
                } 
                else {
                    history.push({
                        pathname: '/thank_you_cr',
                        state: state
                    });
                }
            })
            .catch(function(err) {
                console.log(err);
            });
        }
        else {
            setErrors("Favorite Resort is required.")
        }
    }
    
    const { first_name, last_name, email_address, favorite_resort } = state;

    return (
        <div>
            <div>
                <h3>Customer Registration</h3>
            </div>
            <form onSubmit={onSubmitHandler}>
                <div>
                    <label htmlFor="first_name">First Name: </label>
                    <input required type="text" name="first_name" value={first_name} onChange={onChangeHandler}></input>
                </div>
                <div>
                    <label htmlFor="last_name">Last Name: </label>
                    <input required type="text" name="last_name" value={last_name} onChange={onChangeHandler}></input>
                </div>
                <div>
                    <label htmlFor="email_address">Email Address: </label>
                    <input required type="text" name="email_address" value={email_address} onChange={onChangeHandler}></input>
                </div>
                <div>
                    <label htmlFor="favorite_resort">Favorite Resort: </label>
                    <div style={{display: 'inline-block', width: '173px'}}>
                        <Select
                            isSearchable={false}
                            value={favorite_resort}
                            onChange={onChangeOptionHandler}
                            options={resorts}
                        />
                    </div>
                </div>
                <div>
                    {errors}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
    
}

export default CustomerRegistration