'use strict';

import React, { useState } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import data from './data.json'
import axios from 'axios'

export const AgGrid = () => {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState(null);
    // const [interestSelected, setinterestSelected] = useState([]);
    // const [filterCol, setfilterCol] = useState('');
    var interestSelected = [];
    var filterCol = ''

    const isExternalFilterPresent = () => {
        console.log('isExternalFilter PResent')
        return true
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);


        axios
            .get('http://localhost:3003')
            .then(res => {
                console.log(res.data)
                setRowData(res.data.rows)
            });
    };


    const temp =function(filterType, value, bool){
         switch (filterType) {
            case 'interest':
                if (bool) {
                    interestSelected.push(value)
                } else {
                    interestSelected = interestSelected.filter(function (thing) {
                        return thing != value;
                    })
                }
                default:

                
        }
        console.log(filterCol, interestSelected)
    }
    // const externalFilterChanged = (filterType, value, bool, newValue) => {
    //     ageType = newValue;
    //     interestSelected.push(value)
    //     // switch (filterType) {
    //     //     case 'interest':
    //     //         if (bool) {
                    
    //     //         } else {
    //     //             interestSelected = interestSelected.filter(function (thing) {
    //     //                 return thing != value;
    //     //             })
    //     //         }
    //     //         default:

                
    //     // }
    //     // ageType = newValue;
    //     console.log(filterCol, interestSelected)
    // };

    const externalFilterChanged = (filterType, value, bool, newValue) => {
        ageType = newValue;
       gridApi.onFilterChanged();
   };

    const ApplyInterestFilter = (filter) => {
         filterCol = filter;
        console.log(filterCol)

        console.log(interestSelected)
        gridApi.onFilterChanged();
    };

    const doesExternalFilterPass = (node) => {
        console.log(filterCol)

        for (let i in interestSelected) {

            if (node.data[filterCol].includes(interestSelected[i])) continue
            return false;
        }
        return true;

    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div className="ExternalFilters">
                <button onClick={e => ApplyInterestFilter()}>Apply Filter</button>
                {data.interests.map((value, index) => {
                    return <label key={value + index}>
                        {value}
                        <input
                            type="checkbox"
                            name={value}
                            id={"interest" + value}
                            value={false}
                            onChange={e => temp("interest", value, e.target.checked)}
                        />
                    </label>
                }
                )}



            </div>
            <div
                id="myGrid"
                style={{
                    height: '700px',
                    width: '100%',
                }}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        minWidth: 120,
                        filter: true,
                    }}
                    animateRows={true}
                    isExternalFilterPresent={isExternalFilterPresent}
                    doesExternalFilterPass={doesExternalFilterPass}
                    onGridReady={onGridReady}
                    rowData={rowData}
                >
                    <AgGridColumn field="interests" minWidth={180} />

                </AgGridReact>
            </div>
        </div>
    );
};

var dateFilterParams = {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
        var cellDate = asDate(cellValue);
        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
        }
        if (cellDate < filterLocalDateAtMidnight) {
            return -1;
        }
        if (cellDate > filterLocalDateAtMidnight) {
            return 1;
        }
    },
};
var ageType = 'everyone';

function asDate(dateAsString) {
    var splitFields = dateAsString.split('/');
    return new Date(splitFields[2], splitFields[1], splitFields[0]);
}

