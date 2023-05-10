import * as SecureStore from 'expo-secure-store';

export async function getFromSecureStore(key) {
    return await SecureStore.getItemAsync(key)
} 
  
export async function saveToSecureStore(key, value) {
    await SecureStore.setItemAsync(key, value);
}
  
export async function deleteFromSecureStore() {
    await SecureStore.deleteItemAsync('secure_token');
}