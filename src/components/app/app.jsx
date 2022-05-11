import React from 'react';
import { PageSwitch } from "../page-switch/page-switch";
import { NewCheckbox } from '../new-checkbox/new-checkbox';
import { Ticket } from '../ticket/ticket';
import logoImg from '../../img/logo.svg';
import { fastestSorting, optimalSorting, cheapestSorting } from '../../lib/sorting';
import "./app.scss";
import { skeletonRender } from '../../lib/skeleton-rendering';

export const App = class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            stopResponse: false,
            loading: false,
            pageControllerValue: 0,
            withoutTransfer: true,
            oneTransfer: true,
            twoTransfer: true,
            threeTransfer: true
        };
    }
    changeCheckboxState = (name) => {
        this.setState((state) => {
            return {[name]: !state[name]}
        });
    }
    handlingCheckboxChange = (e) => {
        const nextChecked = e.target.checked;
        if (e.target.value === "allChecked") {
            this.setState({
                withoutTransfer: nextChecked,
                oneTransfer: nextChecked,
                twoTransfer: nextChecked,
                threeTransfer: nextChecked
            })
        } else {
            this.setState({[e.target.value]: nextChecked});
        }
        
    }
    onOnlyChange = (e) => {
        if (this.state.withoutTransfer !== e) {
            this.setState({withoutTransfer: false})
        }
        if (this.state.oneTransfer !== e) {
            this.setState({oneTransfer: false})
        }
        if (this.state.twoTransfer !== e) {
            this.setState({twoTransfer: false})
        }
        if (this.state.threeTransfer !== e) {
            this.setState({threeTransfer: false})
        }
        this.setState({[e]: true})
    }

    handlingRadioChange = (i) => {
        this.setState({pageControllerValue: i});
    }
    componentDidMount = () => {
        this.showMoreTickets();
    }
    showMoreTickets = async () => {
        this.setState({loading: true});
        const response = await fetch("/api/users/");
        if (!response.ok) return;
        const json = await response.json();
        this.setState({data: [...this.state.data, json]});
        this.setState({stopResponse: json.stop});
        this.setState({loading: false});
    }
    buttonLoading = () => {
        if (((this.state.data === []) && (this.state.loading)) || (this.state.stopResponse)) {
            return false;
        } else if ((this.state.data) && !(this.state.loading)) {
            return <button type='button' className='moreResultsButton' onClick={this.showMoreTickets}>Показать еще билеты</button>;
        } else {
            return <div>
                {skeletonRender(5)}
            </div>
        }
    }
    transferFiltering = (ticket) => {
        if (this.state.withoutTransfer === this.state.oneTransfer === this.state.twoTransfer === this.state.threeTransfer) {
            return true;
        }
        return ((((ticket.segments[0].stops.length === 0)&&(this.state.withoutTransfer))||
        ((ticket.segments[0].stops.length === 1)&&(this.state.oneTransfer))||
        ((ticket.segments[0].stops.length === 2)&&(this.state.twoTransfer))||
        ((ticket.segments[0].stops.length === 3)&&(this.state.threeTransfer)))&&
        (((ticket.segments[1].stops.length === 0)&&(this.state.withoutTransfer))||
        ((ticket.segments[1].stops.length === 1)&&(this.state.oneTransfer))||
        ((ticket.segments[1].stops.length === 2)&&(this.state.twoTransfer))||
        ((ticket.segments[1].stops.length === 3)&&(this.state.threeTransfer))))
    }
    renderTickets = () => {
        const tickets = (this.state.data.map(response => response.tickets.filter(n => {
            return this.transferFiltering(n)}).sort((a, b) => {
                if (this.state.pageControllerValue === 'cheapest') {
                    return cheapestSorting(a, b)
                } else if (this.state.pageControllerValue === 'fastest') {
                    return fastestSorting(a, b)
                } else if (this.state.pageControllerValue === 'optimal') {
                    return optimalSorting(a, b)
                } else {
                    return this
                }  
            }).map((ticket, index) => <Ticket key={index} value={ticket}/>))
        )
        if ((tickets[0]) && (tickets[0].length === 0)) {
            return (<h2 className='strictFiltersWarning'>
            Не найдено результатов
            </h2>)
        } else {
            return tickets;
        }
    }
    render() {
        return(
            <div className='main'>
                <a href="https://www.aviasales.ru/" className='logo__href'>
                    <img className='logo' src={logoImg} alt='logo' width='60px' height='60px'/>
                </a>
                <div className='content'>
                    <div className='filterPanel'>
                        <h2 className='filterPanel__heading'>Количество пересадок</h2>
                        <div className="filterPanel__container">
                            <NewCheckbox id='checkboxFilterPanel1' 
                                label="Все" 
                                checked={this.state.withoutTransfer && this.state.oneTransfer && this.state.twoTransfer && this.state.threeTransfer} 
                                value="allChecked" 
                                onChange={this.handlingCheckboxChange} 
                                onFilter={() => this.onOnlyChange("allChecked")}
                            />
                            <NewCheckbox id='checkboxFilterPanel2' 
                                label="Без пересадок" 
                                checked={this.state.withoutTransfer} 
                                value="withoutTransfer" 
                                onChange={this.handlingCheckboxChange} 
                                onFilter={() => this.onOnlyChange("withoutTransfer")}
                            />
                            <NewCheckbox id='checkboxFilterPanel3' 
                                label="1 пересадка" 
                                checked={this.state.oneTransfer} 
                                value="oneTransfer" 
                                onChange={this.handlingCheckboxChange} 
                                onFilter={() => this.onOnlyChange("oneTransfer")}
                            />
                            <NewCheckbox id='checkboxFilterPanel4' 
                                label="2 пересадки" 
                                checked={this.state.twoTransfer} 
                                value="twoTransfer" 
                                onChange={this.handlingCheckboxChange} 
                                onFilter={() => this.onOnlyChange("twoTransfer")}
                            />
                            <NewCheckbox id='checkboxFilterPanel5' 
                                label="3 пересадки" 
                                checked={this.state.threeTransfer} 
                                value="threeTransfer" 
                                onChange={this.handlingCheckboxChange} 
                                onFilter={() => this.onOnlyChange("threeTransfer")}
                            />
                        </div>
                    </div>
                    <div className='biletsPanel'>
                        <div className="pageController">
                            <PageSwitch name="radioBiletsPanel" 
                                value='cheapest' 
                                label="Самый дешевый" 
                                checked={this.state.pageControllerValue==='cheapest'} 
                                onChange={() => this.handlingRadioChange('cheapest')}
                            />
                            <PageSwitch name="radioBiletsPanel" 
                                value='fastest' 
                                label="Самый быстрый" 
                                checked={this.state.pageControllerValue==='fastest'} 
                                onChange={() => this.handlingRadioChange('fastest')}
                            />
                            <PageSwitch name="radioBiletsPanel" 
                                value='optimal' 
                                label="Оптимальный" 
                                checked={this.state.pageControllerValue==='optimal'} 
                                onChange={() => this.handlingRadioChange('optimal')}
                            />
                        </div>
                    </div>
                    <div className='ticketsPanel'>
                        <div className='ticketsPanel__container'>
                            {this.renderTickets()}
                        </div>
                        {this.buttonLoading()}
                    </div>
                </div>
            </div>
        )
    }
}
