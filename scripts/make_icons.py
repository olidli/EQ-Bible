import struct, zlib, os

def create_solid_png(path, r, g, b, a=255, size=81):
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xFFFFFFFF
    ihdr = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    raw_data = b''
    for y in range(size):
        raw_data += b'\x00'
        for x in range(size):
            cx, cy = size // 2, size // 2
            radius = size // 2 - 4
            dx, dy = x - cx, y - cy
            if dx*dx + dy*dy <= radius*radius:
                raw_data += struct.pack('BBBB', r, g, b, a)
            else:
                raw_data += struct.pack('BBBB', 0, 0, 0, 0)
    compressed = zlib.compress(raw_data)
    idat_crc = zlib.crc32(b'IDAT' + compressed) & 0xFFFFFFFF
    idat = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    iend_crc = zlib.crc32(b'IEND') & 0xFFFFFFFF
    iend = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    with open(path, 'wb') as f:
        f.write(sig + ihdr + idat + iend)

base = r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\images'
create_solid_png(os.path.join(base, 'tab_home.png'), 153, 153, 153)
create_solid_png(os.path.join(base, 'tab_category.png'), 153, 153, 153)
create_solid_png(os.path.join(base, 'tab_tools.png'), 153, 153, 153)
create_solid_png(os.path.join(base, 'tab_profile.png'), 153, 153, 153)
create_solid_png(os.path.join(base, 'tab_home_active.png'), 74, 144, 217)
create_solid_png(os.path.join(base, 'tab_category_active.png'), 74, 144, 217)
create_solid_png(os.path.join(base, 'tab_tools_active.png'), 74, 144, 217)
create_solid_png(os.path.join(base, 'tab_profile_active.png'), 74, 144, 217)
print('8 icons created')
