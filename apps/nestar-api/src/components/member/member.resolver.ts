import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InternalServerErrorException } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { MemberService } from './member.service';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => Member)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		try {
			console.log('Mutation: signup');
			return this.memberService.signup(input);
		} catch (err) {
			console.log('Error, signup:', err);
			throw new InternalServerErrorException(err);
		}
	}

	@Mutation(() => Member)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		try {
			console.log('Mutation: login');
			return this.memberService.login(input);
		} catch (err) {
			console.log('Error, signup:', err);
			throw new InternalServerErrorException(err);
		}
	}
}
