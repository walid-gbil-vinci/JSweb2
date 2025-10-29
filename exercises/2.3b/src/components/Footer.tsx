
interface Footer{
    text : string;
}

const Footer = (props : Footer) =>{
    return <h1>{props.text}</h1>;

};

export default Footer;