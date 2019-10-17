import React from 'react'

import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub';
import { createTodo } from './graphql/mutations'
import { useEffect, useReducer } from 'react' // using hooks
// import { listTodos } from './graphql/queries'
import config from './aws-exports'
import { onCreateTodo } from './graphql/subscriptions'

import Amplify, { Analytics, Storage } from 'aws-amplify';
import { withAuthenticator, S3Album } from 'aws-amplify-react';
import signUpConfig from './SignUpConfig';

Amplify.configure(config);
Storage.configure({ level: 'private' });

API.configure(config)
PubSub.configure(config);

const listTodos = `query listTodos {
  listTodos{
    items{
      id
      name
      description
    }
  }
}`;

const addTodo = `mutation createTodo($name:String! $description: String!) {
  createTodo(input:{
    name:$name
    description:$description
  }){
    id
    name
    description
  }
}`;

const todoMutation = async () => {
  const todoDetails = {
    name: 'Party tonight!',
    description: 'Amplify CLI rocks!'
  };

  const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
  alert(JSON.stringify(newTodo));
};

const listQuery = async () => {
  console.log('listing todos');
  const allTodos = await API.graphql(graphqlOperation(listTodos));
  alert(JSON.stringify(allTodos));
};

const post = async () => {
  console.log('calling api');
  const response = await API.post('shakogeleAPI', '/items', {
    body: {
      id: '1',
      name: 'hello amplify!'
    }
  });
  alert(JSON.stringify(response, null, 2));
};
const get = async () => {
  console.log('calling api');
  const response = await API.get('shakogeleAPI', '/items/object/1');
  alert(JSON.stringify(response, null, 2));
};
const list = async () => {
  console.log('calling api');
  const response = await API.get('shakogeleAPI', '/items/1');
  alert(JSON.stringify(response, null, 2));
};

const initialState = {todos:[], file: ""};
const reducer = (state, action) =>{
  switch(action.type){
    case 'QUERY':
      return {...state, todos:action.todos}
    case 'SUBSCRIPTION':
      return {...state, todos:[...state.todos, action.todo]}
    case 'FILE':
      return {...state, file: action.file}
    default:
      return state
  }
}

async function createNewTodo() {
  const todo = { name: "Use AppSync" , description: "Realtime and sdkjncsk ksjdncs"}
  await API.graphql(graphqlOperation(createTodo, { input: todo }))
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    getData();
    Analytics.record('Amplify_CLI');
    const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: (eventData) => {
        console.log({eventData});
        const todo = eventData.value.data.onCreateTodo;
        dispatch({type:'SUBSCRIPTION', todo})
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function getData() {
    const todoData = await API.graphql(graphqlOperation(listTodos))
    dispatch({type:'QUERY', todos: todoData.data.listTodos.items});
  }

  const uploadFile = (evt) => {
    const file = evt.target.files[0];
    const name = file.name;
  
    Storage.put(name, file).then(() => {
      dispatch({type:'FILE', file: name})
    })
  }
  
  return (
    <div>
      <div className="App">
        <p> Pick a file</p>
        <input type="file" onChange={uploadFile} />
        <button onClick={listQuery}>GraphQL Query</button>
        <button onClick={todoMutation}>GraphQL Mutation</button>
        <button onClick={post}>POST</button>
        <button onClick={get}>GET</button>
        <button onClick={list}>LIST</button>

        <S3Album level="private" path='' />
      </div>
    <div className="App">
      <button onClick={createNewTodo}>Add Todo</button>
    </div>
    <div>{ state.todos.map((todo, i) => <p key={todo.id}>{todo.name} : {todo.description}</p>) }</div>
  </div>
  );
}

export default withAuthenticator(App, { signUpConfig });

