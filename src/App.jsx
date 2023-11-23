import { useState} from "react"
import "./styles.css"

export default function App(){
  const [data, setData] = useState(null)
  const [weather, setWeather] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()

    handleRest(event)
  }

  const handleRest = (event) => {
      event.preventDefault()

      const formData = new FormData(event.target)
      const userText = formData.get("inputName")
      
      fetch('http://localhost:5000/search', {method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify({ userInput : userText })})
        .then((res) => {
          if (!res.ok) {
            console.log('Could not set data', res.status)
          }
          return res.json()
        })
        .then((data) => {
          console.log(2)
          console.log(data)
          setData(data)
        })
        .catch ((error)=>{
          console.log(error)
        })
  }

  return (
    <>
      <h1>Brochure Generator</h1>
      <form action="/flask-server/search" method = "POST" onSubmit = {handleSubmit}>
        <input type="text" name="inputName" placeholder="Where We Going?"/>
        {/* <input type="text" name="inputTime" placeholder="In How Many Days Are You Going?"/> */}
        <button type="submit">Submit</button>
      </form>
      <div>
        {data ? 
        <>
          <h2>Best Restaurants Near:</h2>
          <ul>{data["Rest"].map((place, index) => (<li key={index}>{place}</li>))}</ul> 
          <h2>Weather:</h2>
          <ul>{data["Weather"].map((place, index) => (<li key={index}>{place}</li>))}</ul> 
        </> 
        : ""}
      </div>
    </>
  )
};