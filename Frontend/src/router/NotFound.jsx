import { Route } from "react-router-dom"
import { NotFound } from "../components/error/NotFound"
export const NotFound = [
  <>
  <Route key="invalid-route" path="/invalid-route" element={NotFound}/>
  </>
]