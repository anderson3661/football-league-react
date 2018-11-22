import React from 'react';
import { connect } from 'react-redux'
import { adminUpdate as addValue } from '../../redux/actions'

let Admin = ({appData, dispatch}) => {
    let input1;
    let input2;
    // console.log(props);

    return ( 
        <div>
            {console.log(appData)}
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if (!input1.value.trim()) { return }
                    if (!input2.value.trim()) { return }
                    dispatch(addValue(input1.value))
                    input1.value = ''
                    input2.value = ''
                }}
            >
                <input ref={node => {input1 = node}} />
                <input ref={node => {input2 = node}} />
                <button type="submit">Add Value</button>
            </form>
        </div>
     );
}

const mapStateToProps = (state, ownProps) => {
    return {
        appData: state.appData
    }
}

Admin = connect(mapStateToProps, null)(Admin)
 
export default Admin;