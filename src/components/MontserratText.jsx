import { StyleSheet, Text, View } from "react-native";


const MontserratText = ({children,style}) => {
    return(
         <Text style={{...StyleSheet.textMonserrat,...style}}>{children}</Text>
    )
}

export default MontserratText

const styles = StyleSheet.create({
    textMonserrat:{
        fontFamily:"Montserrat"
    }
})