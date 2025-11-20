

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
    return (
        <input
            {...props}
            className={`border border-gray-300 bg-white/30 p-2 rounded-md focus:outline-none ${props.className}`}
        />
    );
};

export default TextInput;
