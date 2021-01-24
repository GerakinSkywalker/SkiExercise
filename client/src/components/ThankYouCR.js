import React from "react";

function ThankYouCR(props) {
    return (
        <div>
            <p>Thank you, {props.location.state.first_name}!</p>
        </div>
    )
    
}

export default ThankYouCR