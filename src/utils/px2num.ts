export const px2num = (px: string | number | undefined) => typeof px === 'string' ? parseFloat(px) : px || 0;
