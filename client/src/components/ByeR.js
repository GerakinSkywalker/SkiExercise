import React from "react";

function ByeR(props) {
    return (
        <div>
            <p>Bye, {props.location.state.name}!</p>
        </div>
    )
    
}

export default ByeR