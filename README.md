# Connection Status Indicator for Meteor with React

[![npm version](https://badge.fury.io/js/meteor-react-status.svg)](https://badge.fury.io/js/meteor-react-status)

## How it Looks
![How it looks](http://i.imgur.com/3W1cREh.gif)

## Install

```sh
npm install --save meteor-react-status
```

## Usage
In your main layout file import:
```js
import ConnectionStatus from 'meteor-react-status'
```

and add somewhere in the page
```html
<ConnectionStatus fullWidth={false} />
```

## TODO
- ~~remove material-ui dependency~~
- write more documentation
- make customizable
- add manual retry button

## Thanks

- [React NPM Boilerplate](https://github.com/juliancwirko/react-npm-boilerplate)
- [React Meteor Status Smart Package](https://github.com/creatorkuang/react-meteor-status/)

## License

MIT
