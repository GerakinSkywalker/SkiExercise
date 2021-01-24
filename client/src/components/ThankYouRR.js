import React from "react";

function ThankYouRR(props) {
    return (
        <div>
            <p>Thank you, {props.location.state.name}!</p>
        </div>
    )
    
}

export default ThankYouRR