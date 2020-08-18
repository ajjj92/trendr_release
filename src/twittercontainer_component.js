'use strict';



class Ultwitter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			twitData: [],
			value: "....",
			activeCountry: "US"

		}

		this.handleSubmit = this.handleSubmit.bind(this)
		this.handlePost = this.handlePost.bind(this)


	}
	componentDidMount() {


		fetch("OnlyCountries.json").then((result) => {
			result.json().then((data) => {
				data['onAutocomplete'] = this.handlePost
				//document.getElementById
				var elems = document.getElementById('twitter-autocomplete');
				var instances = M.Autocomplete.init(elems, data);
			})
		}
		)

		fetch('/defaultTwitter')
			.then(response => response.json())
			.then(data =>
				this.setState((state, props) => {
					return {
						twitData: data.twitterData,
						activeCountry: data.activeCountry
					}
				})
			);
	}

	handlePost(state) {

		fetch('/searchTwitter', {
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
						twitData: data.twitterData,
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


	render() {

		return (
			<div className='col s12'>
				<form onSubmit={this.handleSubmit} autoComplete='off'>
					<div className='input-field'>
						<i className='material-icons prefix'>search</i>
						<input id='twitter-autocomplete' type='text' className='autocomplete' name='country'
							required />
					</div>
				</form>
				<h4 className='center'> Tweets in {this.state.activeCountry} </h4>
				<ul className='collection with-header' id='scrollcontainer'>
					<li className='collection-header'>
						{this.state.twitData.map((item, index) => {
							return <div className='collection-item' key={index}>
								<div> 
									<h5>{item.title} </h5>
								</div>
								<div> 
								<i className='tiny material-icons prefix'>send</i>
									{'    '+item.hits}
									<a href={item.url} className='secondary-content' target='blank'>
										<i className='small material-icons'> insert_link </i>
									</a>
								</div>
							</div>
						})}

					</li>
				</ul>



			</div>
		);
	}

}

ReactDOM.render(
	<Ultwitter />,
	document.getElementById('twittercontainer')
);