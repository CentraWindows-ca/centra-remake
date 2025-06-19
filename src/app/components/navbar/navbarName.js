import styles from './navbar.module.css';

var os = require('os');

export default function NavbarName(props) {

    return (
        <div>{os.userInfo().username}</div>
    )
}
