import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {

  constructor( 
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private userService: UsersService
  ){

  }

  async create(post: CreatePostDto) {
    
    const userFound = await this.userService.getUser(post.authorId);

    if (userFound instanceof HttpException) {
      return userFound;
    }

    const newPost = this.postRepository.create(post);
    return this.postRepository.save(post);

  }

  findAll() {
    return this.postRepository.find({
      relations: ['author']
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
