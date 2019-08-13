import React, { Component } from 'react';
import { Select, Radio, Button, message, Input, Drawer, Icon, Card } from 'antd';
import 'antd/dist/antd.css';

const { Option } = Select;
const { Search } = Input;

const type = "type",
    eggs = "egg-group",
    resGender = "pokemon_species_details",
    resEggs = "pokemon_species",
    resType = "pokemon",
    limitPok = "?offset=0&limit=964";

class FilterSearch extends Component {
    state = {
        arrPokemon: [],
        eggGroup: [],
        type: [],
        arrGender: [],
        arrEggs: [],
        arrType: [],
        arrEnd: [],
        pokemonDetals: { abilities: [], sprites: { front_default: "" }, types: [], stats: [] },
        selectGender: "male",
        selectEggs: "",
        selectType: "",
        loadingBtn: false,
        visDrawer: false,
        loadingSearch: false
    }

    componentDidMount = () => {
        this.getPokemonAPI("type", type);
        this.getPokemonAPI("eggGroup", eggs);
        this.getPokemonAPI("arrPokemon", resType, limitPok);
    }
    getPokemonAPI = async (el, a, b = "", prop = "results") => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/${a}/${b}`);
            const json = await response.json();
            this.setState({ [el]: json[prop] });
        } catch (error) {
            throw new Error("loading error")
        }
    }
    getPokemonAPIName = async (a) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${a}`);
            const json = await response.json();
            this.setState({ pokemonDetals: json, loadingBtn: false });
        } catch (error) {
            throw new Error("loading error");
        }
    }
    changeGender = (e) => {
        this.setState({ selectGender: e.target.value });
    }
    selectEgggroup = (value) => {
        this.setState({ selectEggs: value });
    }
    selectTypes = (value) => {
        this.setState({ selectType: value });
    }
    clickFilter = async () => {
        await this.setState({ loadingSearch: true })
        await this.getPokemonAPI("arrGender", "gender", this.state.selectGender, resGender);
        await this.getPokemonAPI("arrEggs", "egg-group", this.state.selectEggs, resEggs);
        await this.getPokemonAPI("arrType", "type", this.state.selectType, resType);
        let arr = new Array;
        let arr1 = new Array;
        for (let item1 of this.state.arrGender) {
            for (let item2 of this.state.arrEggs) {
                (item1.pokemon_species.name === item2.name) && arr.push(item1.pokemon_species);
            }
        }
        for (let item1 of arr) {
            for (let item2 of this.state.arrType) {
                (item1.name === item2.pokemon.name) && arr1.push(item1);
            }
        }
        await this.loadingTimeout();
        this.setState({ arrEnd: arr1 });
    }
    loadingTimeout = () => {
        setTimeout(() => {
            this.setState({ loadingSearch: false })
        }, 700);
    }
    clickSearch = (value) => {
        let result;
        for (let item of this.state.arrPokemon) {
            if (item.name === value.toLowerCase()) {
                result = true
            };
        }
        if (result) {
            this.getPokemonAPIName(value.toLowerCase());
            this.setState({ loadingBtn: true, visDrawer: true })
        } else {
            message.error('Name not found!');
        }
    }
    clickPokemon = (e) => {
        this.getPokemonAPIName(e.target.value);
        this.setState({ loadingBtn: true, visDrawer: true })
    }
    closeDrawer = () => {
        this.setState({ visDrawer: false })
    }
    showContent = () => {
        const { loadingSearch, arrEnd } = this.state;
        return (!loadingSearch) ?
            (arrEnd.length === 0) ?
                <div className="main__content">
                    <div className="main__message">not found</div>
                </div> :
                <div className="main__content">
                    {arrEnd.map((item, index) =>
                        <Button
                            key={index}
                            className="main__pokemon-item"
                            onClick={this.clickPokemon}
                            value={item.name}
                            type="primary"
                            size="large"
                        >
                            {item.name.toUpperCase()}
                        </Button>
                    )}
                </div> :
            <div className="main__content">
                <div className="main__icon">
                    <Icon className="icon" type="loading" />
                </div>
            </div>
    }
    renderDetals = () => {
        const { pokemonDetals } = this.state;
        return <div className="detals-content-media">
            <div className="detals__container">
                <div className="detals__content-inner">
                    <div>Base experience</div>
                    <div>{pokemonDetals.base_experience}</div>
                </div>
                <div className="detals__content-inner">
                    <div>Height</div>
                    <div>{pokemonDetals.height}</div>
                </div>
                <div className="detals__content-inner">
                    <div>Weight</div>
                    <div>{pokemonDetals.weight}</div>
                </div>
            </div>
        </div>
    }
    render() {
        const { selectGender, type, eggGroup, pokemonDetals, visDrawer, loadingBtn, selectType, selectEggs } = this.state;
        return (
            <div className="global">
                <div className="header">
                    <div className="header__search">
                        <Search
                            placeholder="input name"
                            enterButton="Search"
                            size="large"
                            onSearch={this.clickSearch}
                        />
                    </div>
                </div>
                <div className="container">
                    <div className="main">
                        <div className="main__filter">
                            <div className="main__filter-select">
                                <div className="main__filter-egg">
                                    <Select placeholder="Select egg-group" style={{ width: 170 }} onChange={this.selectEgggroup}>
                                        {eggGroup.map((item,index) =>
                                            <Option 
                                                key = {index}
                                                value={item.name}
                                            >
                                                {item.name}
                                            </Option>
                                        )}
                                    </Select>
                                </div>
                                <div className="main__filter-type">
                                    <Select placeholder="Select type" style={{ width: 170 }} onChange={this.selectTypes}>
                                        {type.map((item, index) =>
                                            <Option
                                                key = {index}
                                                value={item.name}
                                            >
                                                {item.name}
                                            </Option>
                                        )}
                                    </Select>
                                </div>
                            </div>
                            <div className="main__filter-radio">
                                <Radio.Group onChange={this.changeGender} value={selectGender}>
                                    <Radio value="male">male</Radio>
                                    <Radio value="female">female</Radio>
                                    <Radio value="genderless">genderless</Radio>
                                </Radio.Group>
                            </div>
                            <Button onClick={this.clickFilter} disabled={(selectType === "" || selectEggs === "") ? "disabled" : false}>Search</Button>
                        </div>
                        {this.showContent()}
                        <Drawer
                            title={
                                <div className="drawer__title">
                                    {pokemonDetals.name}
                                    <img src={pokemonDetals.sprites.front_default} alt="" />
                                    {this.renderDetals()}
                                </div>
                            }
                            placement="bottom"
                            height={450}
                            closable={false}
                            onClose={this.closeDrawer}
                            visible={visDrawer}
                        >
                            {(loadingBtn) ?
                                <div className="icon__container">
                                    <Icon className="icon" type="loading" />
                                </div> :
                                <div className="detals">
                                    <div className="detals__stats">
                                        <div className="detals__content-info">
                                            <div className="detals__content-inner">
                                                <div>Base experience</div>
                                                <div>{pokemonDetals.base_experience}</div>
                                            </div>
                                            <div className="detals__content-inner">
                                                <div>Height</div>
                                                <div>{pokemonDetals.height}</div>
                                            </div>
                                            <div className="detals__content-inner">
                                                <div>Weight</div>
                                                <div>{pokemonDetals.weight}</div>
                                            </div>
                                        </div>
                                        <div className="detals__statist">
                                            <Card title="Stats" bordered={false}>
                                                {pokemonDetals.stats.map((item,index) =>
                                                    <div key={index} className="detals__content-inner">
                                                        <div>{item.stat.name}</div>
                                                        <div>{item.base_stat}</div>
                                                    </div>
                                                )}
                                            </Card>
                                        </div>
                                        <div className="detals__abilities">
                                            <Card title="Abilities" bordered={false}>
                                                {pokemonDetals.abilities.map((item,index) =>
                                                    <div key={index}>{item.ability.name}</div>
                                                )}
                                            </Card>
                                        </div>
                                        <div className="detals__type">
                                            <Card title="Type" bordered={false}>
                                                {pokemonDetals.types.map((item,index) =>
                                                    <div key={index}>{item.type.name}</div>
                                                )}
                                            </Card>
                                        </div>
                                    </div>
                                    <div className="detals__btn">
                                        <Button onClick={this.closeDrawer} type="danger">Close</Button>
                                    </div>
                                </div>
                            }
                        </Drawer>
                    </div>
                </div>
            </div>
        );
    }
}

export default FilterSearch;