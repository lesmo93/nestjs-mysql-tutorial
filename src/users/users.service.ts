import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    ) { }

    async createUser(user: CreateUserDto){
       try {
            const newUser = this.userRepository.create(user);
            return await this.userRepository.save(newUser);
        } catch (error) {
            return new HttpException(error.sqlMessage, HttpStatus.CONFLICT);
        }
    }

    getUsers(){
        return this.userRepository.find();
    }

    async getUser(id: number){
        const user = await this.userRepository.findOne({
            where: {
                id
            },
            relations:['posts','profile']
        });
        if(!user){
            return new HttpException(`No se ha encontrado el usuario con el id ${id}`, HttpStatus.NOT_FOUND);
        }

        return user;

    }

    async deleteUser(id: number){
        const result = await this.userRepository.delete({
            id
        });

        if(result.affected==0){
            return new HttpException(`No se ha encontrado el usuario con el id ${id}`,  HttpStatus.NOT_FOUND)
        }else{
            return {
                message: `Registro con el id ${id} eliminado`,
                statusCode: 200
            }
        };

    }

    async updateUser(id: number, user: UpdateUserDto){

        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        });
        
        if(!userFound){
            return new HttpException(`No se ha encontrado el usuario con el id ${id}`,  HttpStatus.NOT_FOUND)
        }

        const updateUser = Object.assign(userFound, user);
        return this.userRepository.save(updateUser);
    }


    async createProfile(id: number, profile: CreateProfileDto) {
         const userFound = await this.userRepository.findOne({
            where: {id}
         });

         if(!userFound){
            return new HttpException('No se ha encontrado', HttpStatus.NOT_FOUND);
         }

         const newProfile = this.profileRepository.create(profile);
         const saveProfile =  await this.profileRepository.save(newProfile);

         userFound.profile = saveProfile;

         return this.userRepository.save(userFound);

    }

}
