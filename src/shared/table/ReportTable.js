import { useState } from "react"

const ReportTable = (props) => {


    const {
        columns,
        items,
        filteredItems,
        footers,
    } =props

    const [itemsRecord ,setItemsRecord] =useState(items)
 
    const [itemsRecordValue,setItemRecordValue] =useState(items)
    const [filterRecordValue,setFilterRecordValue] =useState(filteredItems)



    console.log("columns",columns)

    return (
        <div>
             <div className="row">

<div className="col-md-12">
       {items.length>0 && 

 
      <table >
       
        <thead>
                    {columns.map((item,index)=>{
                      console.log(item)
                        return(
                          <th >{item.name}</th>
                        )
                    })}
        </thead>

        <tbody>
          {itemsRecord
            ? items.map((month, index) => (
                <tr key={index}>
                  <td className="badge bg-info-light">{month.monthYear}</td>
                  <td className="salesValue">
                    {parseFloat(month.salesValue).toFixed(2)}
                  </td>
                </tr>
              ))
            : filteredItems.map((month, index) => (
                <tr key={index}>
                  <td className="badge bg-info-light">{month.monthYear}</td>
                  <td className="salesValue">
                    {parseFloat(month.salesValue).toFixed(2)}
                  </td>
                </tr>
              ))}
        </tbody>
          
          <tfoot>
        <tr>
          {footers.map((item, index) => {
            return (
              <th key={index}>{item.name}</th>
            );
          })}
          <th>
            {
              new Intl.NumberFormat('en-IN', { 
                style: 'decimal', 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              }).format(
                items.reduce((acc, curr) => acc + parseFloat(curr.salesValue), 0)
              )
            }
          </th>

        </tr>
      </tfoot>

      </table>
}
</div>
</div>
        </div>
    )
}

export default ReportTable