/* global Plotly:true */

import React, { Component } from 'react';

import ReactJSONEditor from './components/ReactJSONEditor.react.js';
import SplitPane from 'react-split-pane';

import createPlotlyComponent from 'react-plotly.js/factory'

import './App.css';
import './styles/Resizer.css';

/* JSON Editor styling */
import './styles/autocomplete.css';
import './styles/contextmenu.css';
import './styles/jsoneditor.css';
import './styles/menu.css';
import './styles/reset.css';
import './styles/searchbox.css';

const Plot = createPlotlyComponent(Plotly);

class App extends Component {

    constructor(props) {
        super(props);

        this.handleJsonChange = this.handleJsonChange.bind(this);
        this.handleNewPlot = this.handleNewPlot.bind(this);

        this.state = {
            json: {},
            plotUrl: ''
        };
    }
    
    handleJsonChange = newJSON => {
        this.setState({json: newJSON});
    }

    handleNewPlot = async event => {
        const input = event.target;
        const metric = await this.parseInputFile(input.files[0]);
        if (metric !== null) {
            this.setState({ json: metric });
        }
    }
    
    parseInputFile = async file => {
        if (file === undefined) {
            return null;
        } else if (file.type !== 'application/json') {
            alert('ERROR: El archivo seleccionado debe tener formato JSON');
            return null;
        } else {
            const text = await file.text();
            return JSON.parse(text);
        }  
    }

    getPlot = metrica => {
        if ('versiones' in metrica) {
            return <Plot
                data={[{
                    x: metrica.versiones,
                    y: metrica.valores,
                    fill: 'tozeroy', // area chart
                }]}
                layout={{
                    autosize: true,
                    title: { title: `${metrica.nombre} por versión` },
                    xaxis: {
                        title: { text: 'Versión' },
                        type: 'category',
                    },
                    yaxis: { title: { text: metrica.nombre } },
                }}
                config={{
                    displayModeBar: true,
                    locale: 'es',
                }}
                useResizeHandler={true}
                style={{ width: "90%", height: "90%" }}
            />;
        } else {
            return null;
        }
    }
    
    render() {
        return (
            <div className="App">
                <SplitPane split="vertical" minSize={100} defaultSize={400}>
                    <div>
                        <div className='controls-panel'>
                           <input type="file" accept="application/json" onChange={this.handleNewPlot}/>
                       </div>
                       <ReactJSONEditor
                           json={this.state.json}
                           onChange={this.handleJsonChange}
                           plotUrl={this.state.plotUrl}
                       />                  
                    </div>                         
                    {this.getPlot(this.state.json)}
                </SplitPane>
            </div>
        );
    }
}

export default App;
