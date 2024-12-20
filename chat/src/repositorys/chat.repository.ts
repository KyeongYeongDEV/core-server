import { Service, Inject } from "typedi";
import mysql from 'mysql2/promise';
import Repository from "./index.repository";
import MessageDTO from "../dto/request/chat";

@Service()
export default class ChatRepository extends Repository {
    constructor(@Inject("pool") pool: mysql.Pool) {
        super(pool);
    }

    async saveMessages(messages: MessageDTO[]) {
        try {
            const query = `
                INSERT INTO message (cr_id, createAt, content, sender_name, u_id)
                VALUES ?`;

            // MessageDTO[]를 (string | number)[][] 형식으로 변환
            const values = messages.map(({ cr_id, createAt, content, sender_name, u_id }) => [
                cr_id,
                new Date(createAt * 1000).toISOString().slice(0, 19).replace('T', ' '),
                content,
                sender_name,
                u_id
            ]);
            console.log(values[0]);
            if(values[0].length !== 0){
                await this.executeQuery(query, [values]); // 2차원 배열로 변환하여 전달
                console.log("✅ Messages saved to DB");
            }
        } catch (error) {
            console.error("saveMessages Repository Error :", error);
            throw error;
        }
    }

    // 이전 대화 불러오기
    async createChatRoom({ title, cr_id } : { title : string, cr_id : string}) {
        const query = `
            INSERT INTO chatRoom (id, title)
            VALUES (?,?)
        `;
        this.executeQuery(query, [cr_id, title]);
    }
}
