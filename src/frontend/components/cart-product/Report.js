import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Modal, Form, Table } from 'react-bootstrap';
import { Button } from 'react-bootstrap-v5';
// import { useDispatch } from 'react-redux';
import { connect, useDispatch, useSelector } from 'react-redux';
// import { addToast } from '../../../../store/action/toastAction';


const Report = (props) => {
    const { show, onHide } = props;

    return (
        <>
        {/* <Modal show={show} onHide={onHide} size='lg' scrollable className="">
            <Modal.Body style={{ height: '500px' }}>
                <div>
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col xs={6} md={4}>
                                <div style={{ height: '100px', width: '100px', borderRadius: '50%', backgroundColor: '#E0E0E0' }}></div>
                            </Col>
                            <Col xs={12} md={8}>
                                <h3>ABC Super Market</h3>
                                <p>Supermarket Address</p>
                                <p>Contact Info</p>
                            </Col>
                        </Row>

                        <Row className="justify-content-md-center">
                            <Table className='invoice-table'>
                                <thead>
                                    <tr>
                                        <th style={{ fontWeight: '800' }}>Sl.No</th>
                                        <th style={{ fontWeight: '800' }}>Product Name</th>
                                        <th style={{ fontWeight: '800' }}>MRP</th>
                                        <th style={{ fontWeight: '800' }}>QTY</th>
                                        <th style={{ fontWeight: '800' }}>RATE</th>
                                        <th style={{ fontWeight: '800' }}>AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Turmeric Powder 100gm</td>
                                        <td>25.00</td>
                                        <td>2</td>
                                        <td>22.00</td>
                                        <td>44.00</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Turmeric Powder 100gm</td>
                                        <td>25.00</td>
                                        <td>2</td>
                                        <td>22.00</td>
                                        <td>44.00</td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Turmeric Powder 100gm</td>
                                        <td>25.00</td>
                                        <td>2</td>
                                        <td>22.00</td>
                                        <td>44.00</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Row>

                        <Row className="justify-content-md-center invoice_calc">
                            <Col xs={12} md={8} lg={4}>
                                <p>Tax Info</p>
                                <p>CGST %: <i class="bi bi-currency-rupee"></i>13.63</p>
                                <p>SGST %: <i class="bi bi-currency-rupee"></i>13.63</p>
                                <p>Total: <i class="bi bi-currency-rupee"></i>406.25</p>
                            </Col>
                            <Col xs={12} md={8} lg={4} className='text-end'>
                                <p>Gross Total:</p>
                                <p>Less/Adj:</p>
                                <p>Rounded Off</p>
                                <p className='grand_total'>Grand Total:</p>
                            </Col>
                            <Col xs={12} md={8} lg={4} className='text-end'>
                                <p>406.05</p>
                                <p>6.00</p>
                                <p>0.16</p>
                                <p className='grand_values'>406.25</p>
                            </Col>
                        </Row>

                        <Row className="justify-content-md-center invoice_details">
                            <Col xs={12} md={8} lg={4}>
                                <p>Invoice No: 12345</p>
                                <p>Date: 24/06/2024 10:00 am</p>
                                <p>Billed by: Ram</p>
                            </Col>
                            <Col xs={12} md={8} lg={4} className='center'>
                                <div>QR</div>
                            </Col>
                            <Col xs={12} md={8} lg={4} className='text-end'>
                                <p>Customer Name: XXXXX</p>
                                <p>Address</p>
                                <p>Mobile</p>
                            </Col>
                            <Col xs={12} md={8} lg={12} className='text-center'>
                                <p><span className='grand_values'>Your Savings:<i class="bi bi-currency-rupee"></i>93.75</span></p>
                                <p>Voice on this Bill:<i class="bi bi-currency-rupee"></i>0.00 | Your Points:<i class="bi bi-currency-rupee"></i>0.00</p>
                                <p>Cash Recieved:<i class="bi bi-currency-rupee"></i>0.25 | Balance Paid:<i class="bi bi-currency-rupee"></i>0.00</p>
                            </Col>
                        </Row>
                        <div className='p-3 text-center'>
                            <i>Thank you.! Visit again.!</i>
                        </div>
                        <Row>
                            <Col className='col-4'>
                                <Button variant='sucess'>Print</Button>
                            </Col>
                            <Col className='col-4'>
                                <Button>Share</Button>
                            </Col>
                            <Col className='col-4'>
                                <Button variant='danger'>Close</Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Modal.Body>
        </Modal> */}
        </>
    )
}

export default Report;
