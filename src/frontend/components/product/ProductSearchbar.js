import React, { useCallback, useEffect, useState } from "react";
import { Col } from "react-bootstrap-v5";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { connect, useDispatch, useSelector } from "react-redux";
import {
    posSearchCodeProduct,
    posSearchNameProduct,
} from "../../../store/action/pos/posfetchProductAction";
import useSound from "use-sound";
import {
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import { addToast } from "../../../store/action/toastAction";
import { toastType, cartItem, update } from "../../../constants";
import ProductModal from "./ProductModal";
import Speak from "../../../assets/images/speak.png";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import PurchaseInvoice from "./PurchaseInvoice";

const ProductSearchbar = (props) => {
    const {
        posAllProducts,
        customCart,
        setUpdateProducts,
        updateProducts,
        updateCart,
        posSearchCodeProduct,
        posSearchNameProduct,
        purchase,
        mode,
    } = props;
    const [searchString, setSearchString] = useState("");
    const cartitems = useSelector((state) => state.cartItems);
    const [keyDown, setKeyDown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [productData, setProductData] = useState({});
    const [search, setSearch] = useState([]);
    const [prevsearch, setPrevSearch] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const dispatch = useDispatch();
    const [forceRender, setForceRender] = useState(false);
    // const [ind, setInd] = useState(0);
    const [tableRendered, setTableRendered] = useState(false);
    const [value, setValue] = useState("");
    const [play] = useSound(
        // "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
    );

    let ind = 0;
    let prev = 0;
    const [calculation, setCalculation] = useState({
        "basicAmount": 0,
        "discAmount": 0,
        "grossAmount": 0,
        "netAmount": 0,
        "netSaleAmount": 0,
        "rate": 0,
        "taxAmount": 0,
        "totalDiscAmount": 0,
        "disc": 0,
        "less": 0,
        "price": 0
    });

    let filterProduct = posAllProducts
        .filter((qty) => qty.attributes.stock >= 0 && qty.attributes.isActive === 1)
        .map((item) => ({
            name: item.attributes.name,
            code: item.attributes.code_barcode,
            id: item.items_id,
            mrp: item.attributes.mrp,
            price: (item.attributes.salesPrice) * (1 + (item.attributes.tax / 100)),
            stock: item.attributes.stock,
            unit: item.attributes.sales_unit_name,
            tax: item.attributes.tax,
            decimal: item.attributes.unit_decimal_points,
            pack_count: item.attributes.pack_count,
            batchNo: item.attributes.batchNo,
        }));

    const formatResult = (item) => {
        // if()
        let line = document.getElementsByClassName('search-bar')[0]?.getElementsByTagName('ul');
        let ul = document.getElementsByClassName('search-bar')[0]?.querySelector('ul');
        // let li = document.createElement('li');

        // Create the <li> element
        let listItem = document.createElement('li');

        // Create the <div> element with class "ellipse"
        let divElement = document.createElement('div');
        divElement.className = 'ellipsis';

        // Create the <table> element
        let tableElement = document.createElement('table');
        tableElement.className = 'search-table';

        // Create the <thead> element
        let theadElement = document.createElement('thead');
        let tableHeaders = ['Code', 'Product Name', 'MRP', 'Price', 'Stock'];

        // Create table headers
        let headerRow = document.createElement('tr');
        tableHeaders.forEach(headerText => {
            let th = document.createElement('th');
            if (headerText === 'Code') {
                th.style.width = '15%';
            }
            else if (headerText === 'Product Name') {
                th.style.width = '50%';
            }
            else {
                th.style.width = '15%';
            }
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        theadElement.appendChild(headerRow);

        // Append the <thead> to the <table>
        tableElement.appendChild(theadElement);

        // Append the <table> to the <div>
        divElement.appendChild(tableElement);

        // Append the <div> to the <li>
        listItem.appendChild(divElement);

        if (ul && listItem) {
            if (line[0].firstElementChild.querySelector('table').className != 'search-table') {
                ul.insertBefore(listItem, ul.firstChild);
            }
        }
        return (
            // <span style={{ display: "block", textAlign: "left" }}>
            //     {item.name}
            // </span>
            <table style={{ width: "100%" }}>
                <tbody>
                    <tr>
                        <td style={{ width: "15%" }}>{item.code}</td>
                        <td id={item.id + item.mrp} style={{ width: "50%" }}>{item.name}</td>
                        <td className="text-end" >{item.mrp.toFixed(2)}</td>
                        <td className="text-end" style={{ width: "15%" }}>{item.price.toFixed(2)}</td>
                        <td className="text-end" style={{ width: "15%" }}>{item.stock + " " + item.unit}</td>
                    </tr>
                </tbody>
            </table>
        );
    };

    const removeSearchClass = () => {
        const html =
            document.getElementsByClassName(`search-bar`)[0].firstChild
                .firstChild.lastChild;
        html.style.display = "none";
    };

    const onProductSearch = (code) => {
        const codeSearch = posAllProducts
            .filter(
                (item) =>
                    item.attributes.code === code ||
                    item.attributes.code === code.code
            )
            .map((item) => item.attributes.code);
        const nameSearch = posAllProducts
            .filter(
                (item) =>
                    item.attributes.name === code ||
                    item.attributes.name === code.name
            )
            .map((item) => item.attributes.name);
        const finalArrays = customCart.map((customId) =>
            code === customId.code ? customId.code : customId.name
        );
        const finalSearch = finalArrays.filter((finalArray) =>
            finalArray === codeSearch[0] ? codeSearch[0] : nameSearch[0]
        );
        const singleProduct = posAllProducts
            .filter(
                (product) =>
                    product.attributes.code === code ||
                    product.attributes.name === code ||
                    product.attributes.code === code.code ||
                    product.attributes.name === code.name
            )
            .map((product) => product.attributes.stock?.quantity);
        const filterQty = updateProducts
            .filter(
                (item) =>
                    item.code === code ||
                    item.name === code ||
                    item.code === code.code ||
                    item.name === code.name
            )
            .map((qty) => qty?.quantity)[0];
        if (finalSearch[0]) {
            if (codeSearch[0] === code) {
                posSearchCodeProduct(codeSearch[0]);
            } else {
                posSearchNameProduct(nameSearch[0]);
            }
            removeSearchClass();
            setSearchString("");
            play();
            let pushArray = [...customCart];
            let newProduct = pushArray.find(
                (element) =>
                    element.code === codeSearch[0] ||
                    element.name === nameSearch[0]
            );
            if (
                updateProducts.filter(
                    (item) =>
                        item.code === code ||
                        item.name === code ||
                        item.code === code.code ||
                        item.name === code.name
                ).length > 0
            ) {
                if (filterQty >= singleProduct[0]) {
                    dispatch(
                        addToast({
                            text: getFormattedMessage(
                                "pos?.quantity.exceeds?.quantity.available.in.stock.message"
                            ),
                            type: toastType.ERROR,
                        })
                    );
                } else {
                    setUpdateProducts((updateProducts) =>
                        updateProducts.map((item) =>
                            (item.code === code ||
                                item.name === code ||
                                item.code === code.code ||
                                item.name === code.name) &&
                                singleProduct[0] > item?.quantity
                                ? { ...item, quantity: item?.quantity + 1 }
                                : item
                        )
                    );
                    setKeyDown(false);
                }
            } else {
                setUpdateProducts([...updateProducts, newProduct]);
                setKeyDown(false);
                removeSearchClass(true);
            }
        }
    };

    let scanProductBarCode = false;
    const handleOnSelect = (result) => {

        // if (keyDown === false && scanProductBarCode === true) {
        //     onProductSearch(result);
        //     scanProductBarCode = false;
        // }

        // if (searchString.trim()?.length !== 0) {
        // onProductSearch(result);
        // }
        console.log("Selected Item", result);
        let cart = cartitems.filter((item) => item.id === result.id && item.mrp === result.mrp);
        if (cartitems.filter((item) => item.id === result.id && item.mrp === result.mrp).length > 0 && purchase === false) {
            cartitems.map((item) => {
                if (item.id === result.id && item.mrp === result.mrp) {
                    if (Number.isInteger(item.quantity)) {
                        item.quantity = item.quantity + 1;
                    } else {
                        item.quantity = (parseFloat(item.quantity) + 1).toFixed(item.decimal);
                    }
                    item.calculation = formCalculation(item);
                    item.netAmount = item.calculation.netAmount;
                    // item.netSalesRate = item.calculation.netSaleAmount;
                    item.taxAmount = item.calculation.taxAmount;
                    item.grossAmount = item.calculation.grossAmount;
                }
            });
            dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
            dispatch({ type: update.UPDATE_ITEM, payload: cart });
        } else {
            setShowModal(true);
        }
        // console.log(cartitems);
        setProductData(result);
        setValue("");
        setInputValue("");
        document.getElementById('combo-box-demo').value = "";
    };

    useEffect(() => {
        console.log("SEARCH VALUE", document.getElementById('combo-box-demo').value);
        // setTimeout(() => {
        // document.getElementById('combo-box-demo').value = "";
        // },500)
        setValue("");
    }, [cartitems]);

    const formCalculation = (cart) => {
        let calc = { ...calculation };
        let rate = cart.calculation.price / (1 + cart?.taxPercentage / 100);
        calc['rate'] = rate.toFixed(2);
        let basicAmount = cart.quantity * rate;
        calc['basicAmount'] = basicAmount.toFixed(2);
        let discAmount = (basicAmount) * (cart.calculation.disc / 100);
        calc['discAmount'] = discAmount.toFixed(2);
        let TotaldiscAmount = parseFloat(discAmount) + parseInt(cart.calculation.less, 10);
        calc['totalDiscAmount'] = TotaldiscAmount.toFixed(2);
        let grossAmount = (basicAmount - discAmount) - cart.calculation.less;
        calc['grossAmount'] = grossAmount.toFixed(2);
        let taxAmount = grossAmount * (cart?.taxPercentage / 100);
        calc['taxAmount'] = taxAmount.toFixed(2);
        let netAmount = grossAmount + taxAmount;
        calc['netAmount'] = netAmount.toFixed(2);
        let netSaleAmount = ((basicAmount - TotaldiscAmount) + taxAmount) / cart.quantity;
        calc['netSaleAmount'] = netSaleAmount.toFixed(2);
        calc['disc'] = cart.calculation.disc,
            calc['less'] = cart.calculation.less;
        calc['price'] = cart.calculation.price;
        // setNetAmount(netAmount.toFixed(2));
        console.log("useeffect calc", calc);
        setCalculation(calc);
        return calc;
    }

    useEffect(() => {
        setSearchString("");
    }, [showModal]);

    useEffect(() => {
        setSearchString("");
    }, [calculation])

    const handleCloseModal = () => setShowModal(false);

    const handleOnSearch = (string, results) => {
        const lowerString = string.trim().toLowerCase();

        if (lowerString === "") {
            setSearchString("");
            return;
        }

        setSearchString(string);
        // console.log(posAllProducts);
        console.log("results", results);
        let searchData = filterProduct;
        const codeSearch = posAllProducts.filter(item =>
            item.attributes.name.toLowerCase().includes(lowerString) ||
            item.attributes.code_barcode.toLowerCase().includes(lowerString)
        );

        if (codeSearch.length > 0) {
            const filterProduct1 = filterProduct.filter(item =>
                item.name.toLowerCase().includes(lowerString) ||
                item.code.toLowerCase().includes(lowerString)
            );

            console.log('filterProduct', filterProduct1);
            if (filterProduct1.length > 0) {
                setSearch(filterProduct1);
            } else {
                setSearch(filterProduct);
            }

            // setTimeout(() => {
            //     setSearch(filterProduct1);
            // }, 1000);            
            setForceRender(prev => !prev);
            if (codeSearch[0].attributes?.stock >= 0) {
                const data = {
                    name: codeSearch[0]?.attributes?.name,
                    code: codeSearch[0]?.attributes?.code,
                    id: codeSearch[0]?.items_id,
                };
                scanProductBarCode = true;
                // handleOnSelect(data);
            } else {
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "pos.this.product.out.of.stock.message"
                        ),
                        type: toastType.ERROR,
                    })
                );
            }
        } else {
            setSearch([]);
        }
    };

    useEffect(() => {
        // setSearch(prev => !prev);
        setSearch(search);
        console.log(search.length > 0 ? formatResult(search[0]) : search[0]);
    }, [search])

    const inputFocus = () => {
        let searchInput = document.querySelector(
            'input[data-test="search-input"]'
        );
        searchInput.focus();
    };

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.altKey && event.code === "KeyQ") {
                event.preventDefault();
                inputFocus();
            }
        };

        document.addEventListener("keydown", keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, []);

    const removeDuplicates = arr => {
        const unique = new Set(arr.map(item => JSON.stringify(item)));
        return Array.from(unique).map(item => JSON.parse(item));
    };

    useEffect(() => {
        // setTableRendered(false);
        renderHeader();
    }, [tableRendered]);

    useEffect(() => {
        // setTableRendered(false);
        renderHeader();
    }, [prevsearch]);

    const renderHeader = () => {
        let ul = document.getElementById('combo-box-demo-listbox');
        let listItem = document.createElement('li');
        listItem.className = "search-result";
        listItem.classList.add('MuiAutocomplete-option');

        listItem.role = 'option';
        listItem.tabIndex = "-1";
        listItem.style.position = 'relative';
        listItem.style.fontWeight = '500';
        listItem.style.padding = '5px 21px';
        listItem.style.cursor = 'pointer';
        listItem.style.display = 'list-item';
        // listItem.style.position = 'sticky';
        listItem.style.background = 'white';
        listItem.style.top = "0";
        listItem.style.zIndex = "10"

        // Create the <div> element with class "ellipse"
        let divElement = document.createElement('div');
        divElement.className = 'ellipsis';

        // Create the <table> element
        let tableElement = document.createElement('table');
        tableElement.className = 'search-table';

        // Create the <thead> element
        let theadElement = document.createElement('thead');
        let tableHeaders = ['Code', 'Product Name', 'MRP', 'Price', 'Stock'];

        // Create table headers
        let headerRow = document.createElement('tr');
        tableHeaders.forEach(headerText => {
            let th = document.createElement('th');
            if (headerText === 'Code') {
                th.style.width = '15%';
            }
            else if (headerText === 'Product Name') {
                th.style.width = '50%';
            }
            else {
                th.style.width = '15%';
            }
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        theadElement.appendChild(headerRow);

        // Append the <thead> to the <table>
        tableElement.appendChild(theadElement);

        // Append the <table> to the <div>
        divElement.appendChild(tableElement);

        // Append the <div> to the <li>
        listItem.appendChild(divElement);

        if (ul && listItem) {
            if (ul.firstElementChild.querySelector('table').className != 'search-table') {
                ul.insertBefore(listItem, ul.firstChild);
            }
        }
    }

    // const handleOnKeyDown = useCallback((e) => {
    //     let elements = document.getElementById('combo-box-demo-listbox').querySelectorAll(".search-options");
    //     let index = ind;
    //     let currentind = 0;
    //     if (elements.length > 0) {
    //         if (e.key === "ArrowDown" && index < elements.length - 1) {
    //             e.preventDefault();
    //             if (index > 0) {
    //                 elements[index - 1].classList.remove('active');
    //             }
    //             elements[index].classList.add('active');
    //             elements[index].focus();
    //             // setInd(index+1);
    //             prev = index;
    //             ind = index + 1;
    //             console.log(elements);
    //         } else if (e.key === "ArrowUp" && index >= 0) {
    //             e.preventDefault();
    //             if (index > 0) {
    //                 elements[prev].classList.remove('active');
    //                 elements[prev - 1].classList.add('active');
    //                 elements[prev - 1].focus();
    //                 prev = prev - 1;
    //                 ind = index - 1;
    //             }

    //             // setInd(index-1);
    //             console.log(elements);
    //         } else if (e.key === "Enter") {
    //             elements[prev].click();
    //             ind = 0;
    //         }
    //     }
    // }, [ind]);

    // useEffect(() => {
    //     debugger
    //     if (tableRendered == true) {
    //         document.addEventListener("keydown", handleOnKeyDown);
    //     }

    //     return () => {
    //         document.removeEventListener("keydown", handleOnKeyDown);
    //     };
    // }, [handleOnKeyDown]);

    // const handleInd = () => {
    //     // alert(ind);
    //     ind = 0;
    // }

    const handleOnInputChange = () => {
        const collection = document.getElementById('combo-box-demo-listbox')?.getElementsByClassName("search-options");
        if (collection?.length > 0) {
            for (let i = 0; i < collection?.length; i++) {
                collection[i].removeAttribute("data-option-index");
                collection[i].setAttribute("data-option-index", i.toString());
            }
        }
    }

    const filterOptions = (options, { inputValue }) => {
        return options.filter(option =>
            option.code.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };
    return (
        <>
            <Col className="position-relative my-3 search-bar col-xxl-8 col-lg-12 col-12">
                <i className="bi bi-search fs-2 react-search-icon position-absolute top-0 bottom-0 d-flex align-items-center ms-2" />
                <Autocomplete
                    disablePortal
                    className="search-bar"
                    id="combo-box-demo"
                    value={value}
                    inputValue={inputValue}
                    options={removeDuplicates(posAllProducts).filter((item) => item?.attributes?.isActive == 1).map((item, ind) => {
                        return {
                            label: item.attributes.name + " / " + ind,
                            id: item.items_id,
                            code: item.attributes.code_barcode,
                            mrp: item.attributes.mrp,
                            price: (item.attributes.salesPrice) * (1 + (item.attributes.tax / 100)),
                            stock: item.attributes.stock,
                            unit: item.attributes.sales_unit_name,
                            tax: item.attributes.tax,
                            decimal: item.attributes.unit_decimal_points,
                            name: item.attributes.name,
                            pack_count: item.attributes.pack_count,
                            sales_unit_name: item.attributes.sales_unit_name,
                            purchase_unit_name: item.attributes.purchase_unit_name,
                            index: ind
                        }
                    })}
                    noOptionsText="No products found"
                    filterOptions={filterOptions}
                    sx={{ width: 100 }}
                    style={{ width: "100%" }}
                    onOpen={() => {
                        setTableRendered(true);
                    }}
                    onClose={() => {
                        setTableRendered(false);
                    }}
                    onChange={(event, value) => {
                        if (value != null) {
                            handleOnSelect(value);
                            setValue("");
                        }
                    }}
                    // onSelect={handleOnSelect(option)}
                    // get={(option) => handleOnSelect(option)}
                    onInputChange={(event, value) => {
                        // handleOnInputChange();
                        setPrevSearch(value);
                        setValue(null);
                        // setInputValue(value);
                    }}
                    // onKeyDown={(e)=> console.log(e.target.value)}
                    placeholder="Search Products"
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        let arr = {
                            id: option.id,
                            code: option.code,
                            mrp: option.mrp,
                            price: option.price,
                            stock: option.stock,
                            unit: option.unit,
                            tax: option.tax,
                            decimal: option.decimal,
                            name: option.name,
                            pack_count: option.pack_count,
                            sales_unit_name: option.sales_unit_name,
                            purchase_unit_name: option.purchase_unit_name
                        }
                        let table = document.getElementById('search-table');
                        return (
                            <>
                                <li tabindex="-1" role="option" data-option-index={option.index} aria-disabled="false" aria-selected="false" className="search-result MuiAutocomplete-option search-options" style={{ position: "relative", padding: "10px 21px", display: "list-item" }} data-test="result" onClick={() => handleOnSelect(arr)}>
                                    <div className="ellipsis" title={option.name}>
                                        <table style={{ width: "100%" }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: "15%" }}>{option.code}</td>
                                                    <td id={option.id + option.mrp} style={{ width: "50%" }}>{option.name}</td>
                                                    <td className="text-end" >{option.mrp.toFixed(2)}</td>
                                                    <td className="text-end" style={{ width: "15%" }}>{option.price.toFixed(2)}</td>
                                                    <td className="text-end" style={{ width: "15%" }}>{option.stock + " " + option.unit}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                                {setTableRendered(true)}
                            </>
                        );
                    }}
                    renderInput={(params) => <TextField {...params} style={{ padding: 'none' }} autoFocus placeholder={placeholderText("pos-globally.search.field.label")} onKeyDown={() => handleOnInputChange()} value={value} onChange={(e) => setInputValue(e.target.value)} />}
                />

                {/* <ReactSearchAutocomplete
                    placeholder={placeholderText("pos-globally.search.field.label")}
                    items={removeDuplicates(posAllProducts).filter((qty) => qty.attributes.stock >= 0 && qty.attributes.isActive === 1)
                        .map((item) => ({
                            name: item.attributes.name,
                            code: item.attributes.code_barcode,
                            id: item.items_id,
                            mrp: item.attributes.mrp,
                            price: (item.attributes.salesPrice) * (1 + (item.attributes.tax / 100)),
                            stock: item.attributes.stock,
                            unit: item.attributes.sales_unit_name,
                            tax: item.attributes.tax,
                            decimal: item.attributes.unit_decimal_points
                        }))}
                    onSearch={handleOnSearch}
                    inputSearchString={searchString}
                    fuseOptions={{ keys: ["name", "code"] }}
                    resultStringKeyName="name"
                    onSelect={(data) => {
                        handleOnSelect(data);
                    }}
                    formatResult={formatResult}
                    showIcon={false}
                    showClear={false}
                    autoFocus={true}
                    maxResults={25}
                /> */}
                <button type="button" className="speak btn btn-primary model-dtn  position-absolute" style={{ borderRadius: "0px 14px 14px 0px" }}><img src={Speak} /></button>
            </Col>
            {purchase ?
                <PurchaseInvoice show={showModal} onHide={handleCloseModal} data={productData} customCart={customCart} updateCart={updateCart}  posAllProducts={posAllProducts} mode={mode}/>
                :
                <ProductModal show={showModal} onHide={handleCloseModal} data={productData} customCart={customCart} updateCart={updateCart} />
            }
        </>
    );
};

const mapStateToProps = (state) => {
    const { posAllProducts, cartItems, update } = state;
    return { posAllProducts, cartItems, update };
};

export default connect(mapStateToProps, {
    posSearchCodeProduct,
    posSearchNameProduct,
})(ProductSearchbar);
