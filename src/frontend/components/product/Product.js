import React, { useEffect, useState } from "react";
import { Card, Badge } from "react-bootstrap-v5";
import { connect, useDispatch, useSelector } from "react-redux";
import useSound from "use-sound";
import { posFetchProduct } from "../../../store/action/pos/posfetchProductAction";
import { posAllProduct } from "../../../store/action/pos/posAllProductAction";
import productImage from "../../../assets/images/brand_logo.png";
import { addToast } from "../../../store/action/toastAction";
import {
    currencySymbolHendling,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { toastType, cartItem, update } from "../../../constants";
import ProductModal from "./ProductModal";

const Product = (props) => {
    const {
        posAllProducts,
        posFetchProduct,
        cartProducts,
        updateCart,
        customCart,
        cartProductIds,
        setCartProductIds,
        settings,
        productMsg,
        newCost,
        selectedOption,
        allConfigData,
    } = props;
    const [updateProducts, setUpdateProducts] = useState([]);
    const cartitems = useSelector((state) => state.cartItems);
    const [product, setProduct] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [productData, setProductData] = useState({});
    const [unit, setUnit] = useState('');
    const [play] = useSound(
        // "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
    );
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
    const [discPercent, setDiscPercent] = useState(0);
    const [lessRs, setLessRs] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        // update cart while cart is updated
        cartProducts && setUpdateProducts(cartProducts);
        const ids = updateProducts.map((item) => {
            return item?.id;
        });
        setCartProductIds(ids);
    }, [updateProducts, cartProducts]);

    useEffect(() => {
        console.log(updateCart);
    })

    const addToCart = async (product) => {
        play();
        setUnit(product.attributes.sales_unit_name);
        let cart = cartitems?.filter((item) => item?.id === product?.items_id && item?.mrp === product?.attributes?.mrp);
        if (cartitems?.filter((item) => item?.id === product?.items_id && item?.mrp === product?.attributes?.mrp)?.length > 0) {
            cartitems?.map((item) => {
                if (item?.id === product?.items_id && item?.mrp === product?.attributes?.mrp) {
                    if (Number.isInteger(item?.quantity)) {
                        item.quantity = item?.quantity + 1;
                    } else {
                        item.quantity = (parseFloat(item?.quantity) + 1).toFixed(item?.decimal);
                    }
                    item.calculation = formCalculation(item);
                    item.netAmount = item?.calculation?.netAmount;
                    // item.netSalesRate = item.calculation.netSaleAmount;
                    item.taxAmount = item?.calculation?.taxAmount;
                    item.grossAmount = item?.calculation?.grossAmount;
                    console.log("CALCULATION", formCalculation(item));
                }
            });
            dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
            dispatch({ type: update.UPDATE_ITEM, payload: cart });

        } else {
            setProductData({
                name: product.attributes.name,
                code: product.attributes.code_barcode,
                id: product.items_id,
                mrp: product.attributes.mrp,
                price: (product.attributes.salesPrice) * (1 + (product.attributes.tax / 100)),
                stock: product.attributes.stock,
                unit: product.attributes.sales_unit_name,
                tax: product.attributes.tax,
                decimal: product.attributes.unit_decimal_points,
                batchNo: product.attributes.batchNo
            });
            setShowModal(true);
        }
    };

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
        if (product.length != 0) {
            addProductToCart(product);
        }
    }, [calculation]);

    const addProductToCart = (product) => {
        const newId = posAllProducts
            .filter((item) => item.items_id === product.items_id)
            .map((item) => item.items_id);
        const finalIdArrays = customCart.map((id) => id.product_id);
        const finalId = finalIdArrays.filter(
            (finalIdArray) => finalIdArray === newId[0]
        );
        const pushArray = [...customCart];
        const newProduct = pushArray.find(
            (element) => element.id === finalId[0]
        );
        const filterQty = updateProducts
            .filter((item) => item.items_id === product.items_id)
            .map((qty) => qty?.quantity)[0];
        if (
            updateProducts.filter((item) => item.id === product.id).length > 0
        ) {
            if (filterQty >= product.attributes.stock?.quantity) {
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

                        item.id === product.id
                            ? {
                                ...item,
                                quantity:
                                    product.attributes.stock?.quantity >
                                        item.quantity
                                        ? item.quantity++ + 1
                                        : null,
                            }
                            : { ...item, id: item.id }
                    )
                );
                updateCart(updateProducts, product);
            }
        } else {
            setUpdateProducts((prevSelected) => [...prevSelected, product]);
            // updateCart((prevSelected) => [...prevSelected, newProduct]);
            let netAmount = (product?.attributes?.salesPrice) * (1 + (product?.attributes?.tax / 100));
            newProduct.netAmount = netAmount.toFixed(2);
            newProduct.netSalesRate = netAmount.toFixed(2);
            newProduct.tax_amount = calculation.taxAmount;
            newProduct.taxPercentage = product.attributes.tax;
            newProduct.grossAmount = calculation.grossAmount;
            newProduct.calculation = calculation;
            newProduct.unit = unit;
            console.log(calculation.taxAmount);
            updateCart(newProduct);

        }
    };

    const isProductExistInCart = (productId) => {
        return cartProductIds.includes(productId);
    };

    const handleCloseModal = () => setShowModal(false);

    const posFilterProduct =
        posAllProducts;
    // &&
    // posAllProducts.filter(
    //     (product) => product.attributes.stock?.quantity > 0.0
    // );
    //Cart Item Array
    const loadAllProduct = (product, index) => {
        let prodval = (product.attributes.salesPrice) * (1 + (product.attributes.tax / 100));
        // return product.attributes.stock >= !0.0 ? (
        return (
            <>
                <div
                    className="product-custom-card"
                    key={index}
                    onClick={() => addToCart(product)}
                >
                    <Card
                        className={`position-relative h-100 ${isProductExistInCart(product.id) ? "product-active" : ""
                            }`}
                    >
                        <Card.Img
                            variant="top"
                            src={
                                product.attributes.product_image
                                    ? product.attributes.product_image
                                    : productImage
                            }
                        />
                        <Card.Body className="px-2 pt-2 pb-1 custom-card-body">
                            <h6 className="product-title mb-0 text-gray-900 text-center border-bottom pb-1">
                                {product.attributes?.name}
                            </h6>
                            <span className="fs-small text-gray-700">
                                {product.attributes.code}
                            </span>
                            <p className="m-0 w-50 d-inline-block text-start pt-1">
                                <Badge
                                    bg="info"
                                    text="white"
                                    className="product-custom-card__card-badge"
                                >
                                    {product.attributes.stock &&
                                        product.attributes.stock}{" "}
                                    {/* {product?.attributes?.sales_unit_name} */}
                                </Badge>
                            </p>
                            <p className="m-0 w-50 d-inline-block text-end">
                                <Badge
                                    bg="primary"
                                    text="white"
                                    className="product-custom-card__card-badge"
                                >
                                    {/* {currencySymbolHendling(
                                    allConfigData,
                                    settings.attributes &&
                                        settings.attributes.currency_symbol,
                                    newCost
                                        ? newCost
                                        : (product.attributes.salesPrice) * (1 + (product.attributes.tax / 100))
                                )} */}
                                    <i class="bi bi-currency-rupee"></i>
                                    {prodval.toFixed(2)}
                                </Badge>
                            </p>
                        </Card.Body>
                    </Card>
                </div>
            </>
        )
        // : (
        //     ""
        // );
    };

    return (
        <>
            <div
                className={`${posFilterProduct && posFilterProduct.length === 0
                    ? "d-flex align-items-center justify-content-center"
                    : ""
                    } product-list-block pt-1`}
            >
                <div className="d-flex flex-wrap product-list-block__product-block">
                    {posFilterProduct && posFilterProduct.length === 0 ? (
                        <h4 className="m-auto">
                            {getFormattedMessage("pos-no-product-available.label")}
                        </h4>
                    ) : (
                        ""
                    )}
                    {productMsg && productMsg === 1 ? (
                        <h4 className="m-auto">
                            {getFormattedMessage("pos-no-product-available.label")}
                        </h4>
                    ) : (
                        posFilterProduct &&
                        posFilterProduct.filter((item) => item.attributes.isActive == 1).map((product, index) => {
                            return loadAllProduct(product, index);
                        })
                    )}
                </div>
            </div>
            <ProductModal show={showModal} onHide={handleCloseModal} data={productData} customCart={customCart} updateCart={updateCart} />
        </>
    );
};

const mapStateToProps = (state) => {
    const { posAllProducts, allConfigData, cartItems, update } = state;
    return { posAllProducts, allConfigData, cartItems, update };
};

export default connect(mapStateToProps, { posAllProduct, posFetchProduct })(
    Product
);
