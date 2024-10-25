//Speaker side code
#include<WiFi.h>
#include <WiFiMulti.h>
#include<ArduinoWebsockets.h>
#include "driver/i2s.h"
#include "I2s_Setting.h"
#include "Const.h"
using namespace websockets;
WebsocketsClient client;


TaskHandle_t i2sReadTaskHandler = NULL;
WiFiMulti wifiMulti;


void setup() {
  // put your setup code here, to run once:
    
  Serial.begin(115200);
  WiFi.setSleep(WIFI_PS_NONE);
   WiFi.mode(WIFI_STA);
  i2s_buff_init();
  start_to_connect();
  i2s_TX_init();
  Serial.println("Listening Mode");

}

void loop() {

  // put your main code here, to run repeatedly:
   if(wifiMulti.run() != WL_CONNECTED) {
        Serial.println("WiFi not connected!");
        delay(1000);

        if (client.available()) {
          Serial.println("close");
          delay(10000);
          client.close();
                                }
    }

    if (client.available()) 
    client.poll();
  
  if(ESP.getFreeHeap()<=1000)
    ESP.restart();
  

 
}



void start_to_connect(){
   //wifiMulti.addAP("NITHIN","12345678");
    wifiMulti.addAP("KLEF","");
    wifiMulti.addAP("KLEF-SQ","");
    wifiMulti.addAP("K L-University","");

  Serial.println("- WiFi Connecting");
  while(wifiMulti.run() != WL_CONNECTED) {
        Serial.println("....");
        delay(1000);

    }
    
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("+ WiFi Connected");
  Serial.println("- Socket Connecting");
  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);
  while(!client.connect(websockets_server_string)){
    delay(1000);
    Serial.print(".");
  }

  Serial.println("+ Socket Connected");
}

void onMessageCallback(WebsocketsMessage message) {

    int msgLength = message.length();
    if(msgLength==7){
      ESP.restart();
    } 
     if(message.type() == MessageType::Binary){
      if(msgLength > 0){
        i2s_write_data((char*)message.c_str(), msgLength);

      }
    }
}

void onEventsCallback(WebsocketsEvent event, String data) {
    if(event == WebsocketsEvent::ConnectionClosed) {
      Serial.println("Websocket connection closed");
        ESP.restart();
    }
}
