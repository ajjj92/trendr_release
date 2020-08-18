'use strict';



class UlGoogle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            value: "....",
            activeCountry: "US"

        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePost = this.handlePost.bind(this)


    }
    componentDidMount() {
        var elems = document.querySelectorAll('.collapsible');
        var instances = M.Collapsible.init(elems);

        fetch("OnlyCountries.json").then((result) => {
            result.json().then((data) => {
                data['onAutocomplete'] = this.handlePost
                elems = document.getElementById('google-autocomplete');
                instances = M.Autocomplete.init(elems, data);
            })
        }
        )

        fetch('/defaultCountries')
            .then(response => response.json())
            .then(data =>
                this.setState((state, props) => {
                    return {
                        countries: data.countries,
                        activeCountry: data.activeCountry
                    }
                })
            );
    }

    handlePost(state) {

        fetch('/searchCountries', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ country: state }),
        })
            .then(response => response.json())
            .then(data => {
                this.setState((state, props) => {
                    return {
                        countries: data.countries,
                        activeCountry: data.activeCountry
                    }
                })
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    render() {
        return (
            <div className='col s12'>
                <form onSubmit={this.handleSubmit} autoComplete='off'>
                    <div className='input-field'>
                        <i className='material-icons prefix'>search</i>
                        <input id='google-autocomplete' type='text' className='autocomplete' name='country'
                            required />
                    </div>
                </form>
                <h4 className='center'> Trending in {this.state.activeCountry} </h4>

                <ul className='collection with-header' id='scrollcontainer'>
                    <li className='collection-header'>
                    {
                        this.state.countries.length > 0                        
                        ? this.state.countries.map((item, index) => {
                        return <div className='collection-item' key={index}>
                        <div className='row'>
                                <div className='col s2'>
                                    <a href={item.url} target='blank'>
                        <img src={item.pic} className='responsive-img circle' target='_blank'></img>
                        </a>
                        </div>
                        <div className='col s8'>
                        <h5>{item.title} </h5>
                        <div>  
                        <i className='tiny material-icons prefix'>send</i>
                        {'    '+item.hits}
                        </div>
                        <p> 
                        {
                        item.related.length > 0 &&
                        <i className='tiny material-icons prefix'>refresh</i>
                        }
                        {   
                            item.related.map((search,index) =>{
                             return search.query+'    '
                        })}
                        </p>
                        </div>
                        </div>
                    </div>
                        })
                    : <h5>No trending data available</h5>
                    }
                    
                    </li>

             </ul>
            </div>
        );
    }

}

ReactDOM.render(
    <UlGoogle />,
    document.getElementById('googlecontainer')
);
