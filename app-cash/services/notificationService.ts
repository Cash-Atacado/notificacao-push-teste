import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native';
import Constants from 'expo-constants';

type Produto = {
  id?: number;
  codigoProduto: string;
  descricao: string;
};

// customização da notificação
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// função responsável por enviar notificações
async function sendPushNotification(expoPushToken: string, produto: Produto) {

    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Houve uma atualização em um produto',
        body: `${produto.codigoProduto} - ${produto.descricao}`,
        data: { produtoId: produto.id }
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

}

// função para caso dê erro ao registrar a notificação
function handleRegistrationError(errorMessage: string) {
    throw new Error(errorMessage);
}

// função para lidar com as permissões de envio de notificações no lado do client
async function registerForPushNotificationsAsync() {

    // caso o SO seja android
    if(Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('defailt', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [ 0, 250, 250, 250 ],
            lightColor: '#FF231F7C'
        });
    }

    // variável para armazenar o status da permissão (aceita, não aceita)
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if(existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if( finalStatus !== 'granted') {
        handleRegistrationError("As notificações estão desativadas. Para receber avisos importantes, ative as permissões nas configurações do seu celular");
        return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    
    if(!projectId) {
        handleRegistrationError("ID do Projeto não encontrado")
    }

    // se passou por todas as permissões, tenta pegar o pushToken da aplicação
    try {
        const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;

        console.log(pushTokenString);
        return pushTokenString;
    } catch (e: unknown) {
        handleRegistrationError(`${e}`);
    }
    
}