import React, { useReducer } from "react";
import faker from "faker";
import "./App.css";

faker.seed(123);

const data = [...Array(50)].map((item) => ({
    id: faker.random.uuid(),
    name: faker.commerce.productName(),
    image: faker.random.image(),
    price: faker.commerce.price(),
    material: faker.commerce.productMaterial(),
    brand: faker.lorem.word(),
    inStock: faker.random.boolean(),
    fastDelivery: faker.random.boolean(),
    ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
    offer: faker.random.arrayElement([
        "Save 50",
        "70% bonanza",
        "Republic Day Sale",
    ]),
    idealFor: faker.random.arrayElement([
        "Men",
        "Women",
        "Girl",
        "Boy",
        "Senior",
    ]),
    level: faker.random.arrayElement([
        "beginner",
        "amateur",
        "intermediate",
        "advanced",
        "professional",
    ]),
    color: faker.commerce.color(),
}));

const reducerFunction = (state, action) => {
    switch (action.type) {
        case "setInput": {
            return { ...state, input: action.payload };
        }
        case "filterByInputHandler": {
            return { ...state, searchValue: action.payload };
        }
        case "sortHandler": {
            return { ...state, sort: action.payload };
        }
        case "outOfStockHandler": {
            return { ...state, outOfStockFilter: action.payload };
        }
        case "fastDeliveryHandler": {
            return { ...state, fastDeliveryFilter: action.payload };
        }
        default:
            return state;
    }
};

export default function App() {
    const [state, dispatch] = useReducer(reducerFunction, {
        data,
        input: "",
        searchValue: "",
        sort: "none",
        outOfStockFilter: false,
        fastDeliveryFilter: false,
    });
    const filterByInputHandler = () => {
        dispatch({ type: "filterByInputHandler", payload: state.input });
    };
    const sortHandler = (e) => {
        dispatch({ type: "sortHandler", payload: e.target.value });
    };
    const outOfStockHandler = (e) => {
        dispatch({ type: "outOfStockHandler", payload: e.target.checked });
    };
    const fastDeliveryHandler = (e) => {
        dispatch({ type: "fastDeliveryHandler", payload: e.target.checked });
    };
    const getFilteredData = () => {
        let filteredData = [...state.data];
        if (state.searchValue !== "") {
            filteredData = filteredData.filter(({ name }) =>
                name.toLowerCase().includes(state.searchValue.toLowerCase())
            );
        }
        if (state.sort === "asc") {
            filteredData.sort((a, b) => a.price - b.price);
        } else if (state.sort === "desc") {
            filteredData.sort((a, b) => b.price - a.price);
        }

        if (state.outOfStockFilter) {
            filteredData = filteredData.filter(({ inStock }) => !inStock);
        }

        if (state.fastDeliveryFilter) {
            filteredData = filteredData.filter(
                ({ fastDelivery }) => fastDelivery
            );
        }
        return filteredData;
    };
    return (
        <>
            <div className="App">
                <label htmlFor="search">Search: </label>
                <input
                    onChange={(e) =>
                        dispatch({ type: "setInput", payload: e.target.value })
                    }
                    id="search"
                    placeholder="Search By Name"
                    type="text"
                />
                <button onClick={filterByInputHandler}>Search Data</button>
                <fieldset>
                    <legend>Sort By</legend>
                    <div>
                        <input
                            value={"desc"}
                            onChange={sortHandler}
                            name="sort"
                            type="radio"
                        />
                        <label>Price - High to Low</label>
                        <input
                            value={"asc"}
                            onChange={sortHandler}
                            name="sort"
                            type="radio"
                        />
                        <label>Price - Low to High</label>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Filters</legend>
                    <div>
                        <input
                            onChange={(e) => outOfStockHandler(e)}
                            id="outOfStock"
                            type="checkbox"
                        />
                        <label htmlFor="outOfStock">Out of Stock</label>
                        <label>
                            <input
                                onChange={(e) => fastDeliveryHandler(e)}
                                type="checkbox"
                            />
                            Fast Delivery Only
                        </label>
                    </div>
                </fieldset>

                <div className="container">
                    {getFilteredData().map(
                        ({
                            id,
                            name,
                            image,
                            price,
                            productName,
                            inStock,
                            level,
                            fastDelivery,
                        }) => (
                            <div
                                className="card"
                                key={id}
                                style={{
                                    border: "1px solid #4B5563",
                                    borderRadius: "0 0 0.5rem 0.5rem",
                                    margin: "1rem",
                                    maxWidth: "40%",
                                    padding: "0 0 1rem",
                                }}
                            >
                                <img
                                    src={image}
                                    width="100%"
                                    height="auto"
                                    alt={productName}
                                />
                                <h3> {name} </h3>
                                <div>Rs. {price}</div>
                                {inStock && <div> In Stock </div>}
                                {!inStock && <div> Out of Stock </div>}
                                <div>{level}</div>
                                {fastDelivery ? (
                                    <div> Fast Delivery </div>
                                ) : (
                                    <div> 3 days minimum </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}
