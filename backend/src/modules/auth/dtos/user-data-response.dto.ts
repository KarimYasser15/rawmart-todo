import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entity/user.entity';

export class UserDataResponseDto {
    @ApiProperty({ example: 'ejbdakfnskdfnsdkf' })
    accessToken: string;

    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'email@gmail.com' })
    email: string;

    @ApiProperty({ example: 'Karim Yasser' })
    fullName: string;

    static userDateResponse(token: string, user: User): UserDataResponseDto {
        const userDataDto = new UserDataResponseDto();
        userDataDto.accessToken = token;
        userDataDto.id = user.id;
        userDataDto.email = user.email;
        userDataDto.fullName = user.fullName;
        return userDataDto;
    }
}
