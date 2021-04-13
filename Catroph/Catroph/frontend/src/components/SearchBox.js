import React, { useState } from 'react';

export default function SearchBox(props) {
    const [name, setName] = useState("");

    const submitHandler = (event) => {
        event.preventDefault();
        // Redirect the user to the search page
        props.history.push(`/search/name/${name}`);
    };

    return (
        <div>
            <form className="search" onSubmit={submitHandler}>
                <div className="row">
                    <input
                        type="text"
                        name="query"
                        id="query"
                        onChange={ (event) => setName(event.target.value) }
                    ></input>
                    <button className="primary" type="submit">
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            </form>
        </div>
    );
}