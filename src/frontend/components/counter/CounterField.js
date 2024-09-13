import React, { useEffect, useState } from 'react'
import ReactSelect from '../../../shared/select/reactSelect';
import { counterList } from '../../../constants';
import { counterAction } from '../../../store/action/counterAction';
import { connect, useSelector } from 'react-redux';
import Select from "react-select";


const CounterField = (props) => {
    const { counterAction, counterData, setCounter } = props;
    const cou = useSelector((state) => state.counterData);
    const [counters, setCounters] = useState([]);


    useEffect(() => {
        console.log("Counter",cou);
        let response = cou;
        let array=[];
        response.map((da) => {
            console.log(da);
            array.push({label:da.attributes.counterName,value:da.counterId});
        });
        setCounters(array);
    }, [cou]);

    useEffect(() => {
        counterAction();
    }, []);

    return (
        <>
        <div className='col-4 mt-2 mb-2 center'>
            {/* <ReactSelect data={counters} name='counter'
                // isRequired
                defaultValue={{label: 'COUNTER-1', value: 1}}
            // placeholder={getFormattedMessage('select.payment-type.label')}
            /> */}
            <Select
                name="counter"
                options={counters}
                defaultValue={{label: 'COUNTER-1', value: 1}}
                onChange={(e) => setCounter(e.value)}
                // defaultValue={counters[0]}
            />
            {/* <div className='col-4'>hello</div> */}
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    const { counterData } = state;
    return {
        counterData
    }
}

export default connect(mapStateToProps, {
    counterAction
    // fetchHoldLists,
})(CounterField);
