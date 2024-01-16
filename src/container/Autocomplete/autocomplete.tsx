import e from "express";
import { lstat } from "fs";
import React, { useState, useEffect, useRef } from "react";
import "./autocomplete.css";
interface itemList {
    id: number;
    name: string;
    email: string;
}
const itemList = [
    { id: 1, name: "Roger", email: "rogger@gmail.com" },
    { id: 2, name: "John Doe", email: "john@gmail.com" },
    { id: 3, name: "Jacob", email: "jacob@gmail.com" },
    { id: 4, name: "Ross", email: "ross@gmail.com" },
    { id: 5, name: "Chandler", email: "chandler@gmail.com" },
    { id: 6, name: "Joey ", email: "joey@gmail.com" },
    { id: 7, name: "Rachel", email: "rachel@gmail.com" },
    { id: 8, name: "Phoebe", email: "phoebe@gmail.com" },
    { id: 9, name: "Harvey", email: "harvey@gmail.com" },
    { id: 10, name: "Mike", email: "mike@gmail.com" },
];

const Autocomplete = () => {
    const [items, setItems] = useState<itemList[]>(itemList);
    const [input, setInput] = useState<string>("");
    const [chips, setChips] = useState<itemList[]>([]);
    const [filteredItems, setFilteredItems] = useState<itemList[]>([]);
    const [highlightedChip, setHighlightedChip] = useState<
        itemList | undefined
    >();
    const inputRef = useRef<HTMLInputElement>(null);
    const [hideList, setHideList] = useState(true);
    const firstLetter = (name: string) => {
        return name.charAt(0).toUpperCase();
    };
    const addChip = (chip: itemList) => {
        setChips([...chips, chip]);
        setItems((items) =>
            items.filter((item: itemList) => item.name != chip.name)
        );
        setFilteredItems([]);
        setInput("");
        setHighlightedChip(undefined);
    };

    const filterItems = (value: string) => {
        let filteredList: itemList[] = items.filter((item: itemList) =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );

        return filteredList.length > 0 ? filteredList : [];
    };

    const removeChip = (chip: itemList) => {
        setChips(chips.filter((item) => item.id !== chip.id));
        setItems([chip, ...items]);
        setFilteredItems([]);
        if (inputRef.current != null) {
            inputRef.current.focus();
        }
    };

    const handleInputChange = (e: any) => {
        const value = e.target.value;
        setInput(value);
        let list: itemList[] = filterItems(value);

        setFilteredItems(list);
    };

    const handleKeyDown = (e: any) => {
        if (
            e.key === "Backspace" &&
            input === "" &&
            chips.length > 0 &&
            !highlightedChip
        ) {
            setHighlightedChip(chips[chips.length - 1]);
        } else if (
            e.key === "Backspace" &&
            input === "" &&
            chips.length > 0 &&
            highlightedChip
        ) {
            removeChip(highlightedChip);
            setHighlightedChip(undefined);
        }
    };
    // useEffect(()=>{
    //     if(inputRef.current?.focus()){
    //         setHideList(false)
    //     }else{
    //         setHideList(true)
    //     }
    // },[inputRef])

    return (
        <div className="chip-input wrapper">
            <div className="chip-container">
                {chips?.map(
                    (chip: itemList) =>
                        chip && (
                            <div
                                key={chip.id}
                                className={`chipwrapper ${
                                    highlightedChip?.name === chip.name
                                        ? "highlighted"
                                        : ""
                                }`}
                            >
                                <div className="chip-name">
                                    <div className="background">
                                        {firstLetter(chip.name)}
                                    </div>
                                    <p>{chip.name}</p>
                                </div>
                                <span
                                    className="chip-close"
                                    onClick={() => removeChip(chip)}
                                >
                                    x
                                </span>
                            </div>
                        )
                )}
            </div>
            <div className="input-wrapper">
                <input
                    type="text"
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onFocus={() => {
                        setFilteredItems(items);
                        setHideList(false);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={"Search..."}
                />
                {!hideList &&
                    (filteredItems?.length === 0 ? (
                        <div className="item-list">
                            <div className="item-name">No matching item</div>
                        </div>
                    ) : (
                        <div className="item-list">
                            {filteredItems?.map((item: itemList) => (
                                <div
                                    key={item.id}
                                    onClick={() => addChip(item)}
                                >
                                    <div className="item-name">
                                        <div className="background">
                                            {firstLetter(item.name)}
                                        </div>
                                        <p>{item.name}</p>
                                    </div>
                                    <p>{item.email}</p>
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Autocomplete;
