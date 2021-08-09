#!/usr/bin/env node
import fs from 'fs';
import readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var constants;

rl.question("ENTER TYPES/CONSTANTS (comma seperate each): ", function(types) {
    
    if (fs.existsSync("./src/redux")) {
        console.log("redux directory already exists.")
        rl.close();
        return
    }

    constants = types.toUpperCase().split(',')
    console.log(`working on redux directory...`);

    constants.forEach(type=>{
        createDir('/src/redux/types/')
        createDir('/src/redux/reducers/')
        createDir('/src/redux/actions/')
        // createFile('/src/redux/types/index.js', '//redux constants')
        fs.appendFileSync(process.cwd() + '/src/redux/types/index.js', `export const ${type.trim()} = "${type.trim()}";\n`, (err)=>{
            if(err){console.log('\x1b[31m%s\x1b[0m', "An error occurred: ", err)};
        })
    })

    fs.appendFileSync(process.cwd() + '/src/redux/reducers/index.js', `import { ${constants.join(', ')} } from '../types';\n`, (err)=>{
        if(err){console.log('\x1b[31m%s\x1b[0m', "An error occurred: ", err)};
    })
    fs.appendFileSync(process.cwd() + '/src/redux/actions/index.js', `import { ${constants.join(', ')} } from '../types';\n`, (err)=>{
        if(err){console.log('\x1b[31m%s\x1b[0m', "An error occurred: ", err)};
    })

    for(let i = 0; i<constants.length; i++){
        fs.appendFileSync(process.cwd()+ '/src/redux/actions/index.js', `\nexport const action${i+1} = (item) => async(dispatch)=>{
            try{
                dispatch({
                    type: ${constants[i]},
                    payload: {
                    }
                })
            }
            catch(error){
                console.log(error)
            }
        }`)
    }

    fs.appendFileSync(process.cwd() + '/src/redux/reducers/index.js', `\nexport const reducer = (state = [], {type, payload})=>{
        switch(type){`, (err)=>{
        if(err){console.log('\x1b[31m%s\x1b[0m', "An error occurred: ", err)};
    })

    for(let i = 0; i<constants.length; i++){
        fs.appendFileSync(process.cwd()+ '/src/redux/reducers/index.js', `
            case ${constants[i]}:
                return [...state, payload]`, (err)=>{
                    if(err){console.log('\x1b[31m%s\x1b[0m', "An error occurred: ", err)};
                })
    }
    fs.appendFileSync(process.cwd() + '/src/redux/reducers/index.js', `
            default:
                return state
        }
    }`, (err)=>{
        if(err){console.log('\x1b[31m%s\x1b[0m', "An error occurred: ", err)};
    })

    fs.appendFileSync(process.cwd() + '/src/redux/index.js', `
    import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
    import thunk from 'redux-thunk';
    import { reducer } from './reducers';
    
    const reducers = combineReducers({
        state: reducer,
    })
    
    const initialState = {
        state: [],
    }
    
    const store = createStore(reducers, initialState, compose(applyMiddleware(thunk)))
    
    export default store;`, (err)=>{
        if(err){console.log('\x1b[31m%s\x1b[0m', "An error occurred: ", err)};
    })

    rl.close();
});

rl.on("close", function() {
    if (fs.existsSync("./src/redux")) {
        console.log('\x1b[36m',"\nRedux app created. \x1b[0m");
        process.exit(0);
        return
    }
    console.log('\x1b[36m',"\nExiting... \x1b[0m");
    process.exit(0);
});

const createDir = (path) =>{
    fs.mkdirSync(process.cwd() + path, {recursive: true}, (err)=>{
        if(err){
            console.log('\x1b[31m%s\x1b[0m', "An error occurred: ", err)
            return
        }
        console.log("Directory created...")
    })
}