import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
}

interface GroupChatCardProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  members: GroupMember[];
  isOfficial?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  onPress: () => void;
}

export const GroupChatCard: React.FC<GroupChatCardProps> = ({
  id,
  name,
  lastMessage,
  time,
  unreadCount,
  members,
  isOfficial = false,
  isPinned = false,
  isMuted = false,
  onPress,
}) => {
  const renderGroupAvatar = () => {
    const visibleMembers = members.slice(0, 4);
    
    if (isOfficial) {
      return (
        <View style={styles.avatarContainer}>
          <View style={[styles.groupAvatar, styles.officialAvatar]}>
            <Ionicons name="people" size={24} color="#fff" />
          </View>
          <View style={styles.officialBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#07C160" />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.avatarContainer}>
        <View style={styles.groupAvatar}>
          <View style={styles.memberAvatarsGrid}>
            {visibleMembers.map((member, index) => (
              <Image
                key={member.id}
                source={{ uri: member.avatar }}
                style={[
                  styles.memberAvatar,
                  styles[`memberPosition${index}` as keyof typeof styles],
                ]}
              />
            ))}
            {members.length > 4 && (
              <View style={[styles.memberAvatar, styles.memberPosition3, styles.moreMembers]}>
                <Text style={styles.moreMembersText}>+{members.length - 3}</Text>
              </View>
            )}
          </View>
        </View>
        {isPinned && (
          <View style={styles.pinnedBadge}>
            <Ionicons name="pin" size={12} color="#FF9500" />
          </View>
        )}
      </View>
    );
  };

  const renderMemberNames = () => {
    if (members.length === 0) return "";
    if (members.length === 1) return members[0].name;
    if (members.length === 2) return `${members[0].name}, ${members[1].name}`;
    return `${members[0].name}, ${members[1].name} and ${members.length - 2} others`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {renderGroupAvatar()}
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text style={styles.groupName} numberOfLines={1}>
              {name}
            </Text>
            {isMuted && (
              <Ionicons name="volume-mute" size={14} color="#8E8E93" style={styles.muteIcon} />
            )}
          </View>
          <Text style={styles.time}>{time}</Text>
        </View>
        
        <View style={styles.memberRow}>
          <Text style={styles.memberNames} numberOfLines={1}>
            {renderMemberNames()}
          </Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={2}>
            {lastMessage}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  groupAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  officialAvatar: {
    backgroundColor: '#07C160',
  },
  memberAvatarsGrid: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  memberAvatar: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
  },
  memberPosition0: {
    top: 2,
    left: 2,
  },
  memberPosition1: {
    top: 2,
    right: 2,
  },
  memberPosition2: {
    bottom: 2,
    left: 2,
  },
  memberPosition3: {
    bottom: 2,
    right: 2,
  },
  moreMembers: {
    backgroundColor: '#8E8E93',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreMembersText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: '600',
  },
  officialBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 1,
  },
  pinnedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 4,
  },
  muteIcon: {
    marginLeft: 4,
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
  memberRow: {
    marginBottom: 4,
  },
  memberNames: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});