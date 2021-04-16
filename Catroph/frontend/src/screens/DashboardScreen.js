import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { summaryOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Chart from 'react-google-charts';

export default function DashboardScreen() {
    const orderSummary = useSelector((state) => state.orderSummary);
    const { loading, summary, error } = orderSummary;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(summaryOrder());
    }, [dispatch]);

    return (
        <div>
            <div className="row">
                <h1>Dashboard</h1>
            </div>

            {
                loading ? <LoadingBox></LoadingBox>
                :
                error ? <MessageBox variant="danger">{error}</MessageBox>
                :
                <>
                    <ul className="row summary">
                        <li>
                            <div className="summary-title usersColor">
                                <span>
                                    <i className="fa fa-users" /> Users
                                </span>
                            </div>

                            <div className="summary-body">
                                { summary.users[0].numUsers }
                            </div>
                        </li>

                        <li>
                            <div className="summary-title ordersColor">
                                <span>
                                    <i className="fa fa-shopping-cart" /> Orders
                                </span>
                            </div>

                            <div className="summary-body">
                                { summary.orders[0] ? summary.orders[0].numOrders : 0}
                            </div>
                        </li>

                        <li>
                            <div className="summary-title salesColor">
                                <span>
                                    <i className="fa fa-money" /> Sales
                                </span>
                            </div>

                            <div className="summary-body">
                                $ { summary.orders[0] ? summary.orders[0].totalSales.toFixed(2) : 0 }
                            </div>
                        </li>
                    </ul>

                    <div>
                        <div>
                            <h2>Sales</h2>
                            { 
                                summary.dailyOrders.length === 0
                                ? <MessageBox>No Sale</MessageBox>
                                :
                                <Chart
                                    width="100%"
                                    height="400px"
                                    chartType="AreaChart"
                                    loader={ <div>Loading Chart </div> }
                                    data={[
                                        ["Date", "Sales"],
                                        ...summary.dailyOrders.map((item) => [item._id, item.sales])
                                    ]}
                                ></Chart>
                            }
                        </div>
                    </div>

                    <div>
                        <h2>Categories</h2>
                        {
                            summary.productCategories.length === 0 
                            ? <MessageBox>No Category</MessageBox>
                            :
                            <Chart
                                width="100%"
                                height="500px"
                                chartType="PieChart"
                                loader={ <div>Loading Chart</div> }
                                data={[
                                    ["Category", "Products"],
                                    ...summary.productCategories.map((x) => [x._id, x.count])
                                ]}
                            ></Chart>
                        }
                    </div>
                </>
            }
        </div>
    );
}