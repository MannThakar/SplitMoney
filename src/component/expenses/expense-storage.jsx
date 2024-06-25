import {useEffect} from 'react'
const ExpenseStorage = (key,value) => {
    useEffect(() => {
        localStorage.setItem(key,JSON.stringify(value))
    },[key,value])
}
export default ExpenseStorage;