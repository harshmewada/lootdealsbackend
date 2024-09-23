import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { _IdDto } from 'src/commondto';

export class SettingDto {
  @IsString()
  @ApiPropertyOptional()
  email: string;

  @IsString()
  @ApiPropertyOptional()
  telegramLink: string;

  @IsString()
  @ApiPropertyOptional()
  telegramBannerLink: string;

  @IsString()
  @ApiPropertyOptional()
  whatsappLink: string;

  @IsOptional()
  @ApiPropertyOptional()
  telegramBannerImage?: string;

  @IsString()
  @ApiPropertyOptional()
  youtubeLink: string;

  @IsString()
  @ApiPropertyOptional()
  privacyLink: string;

  @IsOptional()
  @ApiPropertyOptional()
  showAds: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  showTelegramBanner: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  showTracking: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  trackingBannerImage?: string;

  @IsOptional()
  @ApiPropertyOptional()
  trackingInstructions?: string;
}
